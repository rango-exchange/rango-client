import type { SwapQueueContext } from '../../types';
import type { FindProxiedNamespace } from '@hub3js/core';
import type { EvmActions, TypedDataDefinition } from '@hub3js/evm';
import type { DefaultNamespaces } from '@hub3js/namespaces';
import type { EvmTransaction } from 'rango-sdk';
import type { PendingSwap, PendingSwapStep } from 'rango-types';

import {
  RPCErrorCode,
  SignerError,
  SignerErrorCode,
  TransactionType,
} from 'rango-types';

import { getCurrentStepTxType } from '../../helpers';
import { getRelatedWalletOrNull } from '../../shared';

export type EvmNamespace = FindProxiedNamespace<'evm', DefaultNamespaces>;

type SendTransactionParameters = NonNullable<
  Parameters<EvmActions['sendTransaction']>[0]
>;

/**
 * A namespace action some wallets add when the hash `sendTransaction` returns
 * is not the on-chain one, e.g. Safe returns a safeTxHash. It resolves the
 * on-chain hash, and is skipped for wallets that don't register it.
 */
const RESOLVE_TRANSACTION_HASH_ACTION = 'resolveTransactionHash';
type ResolveTransactionHash = (hash: string) => Promise<string>;

/** EIP-1193 code for a request the user rejected. */
const USER_REJECTED_REQUEST_CODE = 4001;

function* errorChain(error: unknown) {
  let current: unknown = error;
  while (current) {
    yield current as { name?: string; code?: unknown; message?: string };
    current = current instanceof Error ? current.cause : undefined;
  }
}

function errorChainIncludes(error: unknown, text: string): boolean {
  for (const item of errorChain(error)) {
    if (typeof item.message === 'string' && item.message.includes(text)) {
      return true;
    }
  }
  return false;
}

/**
 * Turns what a wallet or viem throws into a `SignerError`. viem wraps the
 * wallet's error, so a rejection is looked for along the `cause` chain.
 */
export function toEvmSignerError(
  error: unknown,
  code: SignerErrorCode = SignerErrorCode.SEND_TX_ERROR
): SignerError {
  if (SignerError.isSignerError(error)) {
    return error;
  }
  if (!error) {
    return new SignerError(code);
  }

  let isRejected = false;
  let context: Record<string, unknown> | undefined;
  for (const item of errorChain(error)) {
    /*
     * A wallet can attach context for the logs to the error it throws, e.g.
     * WalletConnect adds the session's peer. viem wraps it, so it's looked for
     * along the chain.
     */
    const itemContext = (item as { context?: unknown }).context;
    if (!context && itemContext && typeof itemContext === 'object') {
      context = itemContext as Record<string, unknown>;
    }
    if (
      item.code === USER_REJECTED_REQUEST_CODE ||
      item.name === 'UserRejectedRequestError'
    ) {
      isRejected = true;
      break;
    }
  }

  const message =
    error instanceof Error
      ? (error as Error & { shortMessage?: string }).shortMessage ||
        error.message
      : error;

  return new SignerError(
    code,
    undefined,
    message,
    isRejected ? RPCErrorCode.REJECTION : RPCErrorCode.UNKNOWN_ERROR,
    error,
    context
  );
}

/**
 * Converts a transaction from Rango's API into the request viem's
 * `sendTransaction` takes. `legacyGas` drops the EIP-1559 fees in favour of
 * `gasPrice`, for wallets that reject them.
 *
 * The request holds bigints, so it is built right before sending and never
 * stored with the swap.
 */
export function toEvmTransactionRequest(
  tx: EvmTransaction,
  account: string,
  options: { legacyGas?: boolean } = {}
): SendTransactionParameters {
  const request: Record<string, unknown> = {
    account,
    // The network is checked before sending, so viem doesn't assert it again.
    chain: null,
    to: tx.to,
    /*
     * `0x` rather than undefined, otherwise some wallets could face issue
     * https://github.com/WalletConnect/web3modal/issues/1082#issuecomment-1637793242
     */
    data: tx.data || '0x',
    // Some wallets reject a missing value, so a zero value is sent explicitly.
    value: BigInt(tx.value || 0),
  };

  if (tx.nonce) {
    request.nonce = Number(BigInt(tx.nonce));
  }
  if (tx.gasLimit) {
    request.gas = BigInt(tx.gasLimit);
  }
  if (!options.legacyGas && tx.maxFeePerGas && tx.maxPriorityFeePerGas) {
    request.maxFeePerGas = BigInt(tx.maxFeePerGas);
    request.maxPriorityFeePerGas = BigInt(tx.maxPriorityFeePerGas);
  } else if (tx.gasPrice) {
    request.gasPrice = BigInt(tx.gasPrice);
  }

  // Built loosely because viem types each fee scheme as its own variant.
  return request as SendTransactionParameters;
}

/**
 * The EVM namespace of the wallet that sends the step's transaction. Null when
 * the transaction isn't EVM, or the wallet has no EVM namespace or isn't
 * connected yet.
 */
export function getEvmNamespaceOfStep(
  context: SwapQueueContext,
  swap: PendingSwap,
  step: PendingSwapStep
): EvmNamespace | null {
  if (getCurrentStepTxType(step) !== TransactionType.EVM) {
    return null;
  }
  const sourceWallet = getRelatedWalletOrNull(swap, step);
  if (!sourceWallet) {
    return null;
  }
  try {
    return context.hubProvider(sourceWallet.walletType).get('evm') ?? null;
  } catch {
    return null;
  }
}

function getActiveAddress(namespace: EvmNamespace): string | undefined {
  const [getState] = namespace.state();
  const accounts = getState('accounts') as string[] | null | undefined;
  // Accounts are CAIP-10 (`eip155:1:0xabc`), the address is the last part.
  return accounts?.[0]?.split(':').pop();
}

async function assertWalletMatches(
  namespace: EvmNamespace,
  address: string,
  chainId: string | null
) {
  if (chainId) {
    const walletChainId = await namespace.getChainId();
    if (walletChainId && Number(walletChainId) !== Number(chainId)) {
      throw new SignerError(
        SignerErrorCode.UNEXPECTED_BEHAVIOUR,
        undefined,
        `Wallet chainId: '${Number(
          walletChainId
        )}' doesn't match with required chainId: '${Number(chainId)}' for tx.`
      );
    }
  }

  const walletAddress = getActiveAddress(namespace);
  if (
    walletAddress &&
    address &&
    walletAddress.toLowerCase() !== address.toLowerCase()
  ) {
    throw new SignerError(
      SignerErrorCode.UNEXPECTED_BEHAVIOUR,
      undefined,
      `Wallet address: '${walletAddress.toLowerCase()}' doesn't match with required address: '${address.toLowerCase()}' for tx.`
    );
  }
}

/**
 * Some wallets (e.g. Rainbow over WalletConnect) resolve `eth_sendTransaction`
 * with `'null'` instead of throwing when the user rejects it. Neither viem nor
 * the namespace checks the result, so it's checked here, before it can be
 * stored and polled as the transaction's hash.
 */
function assertTransactionHash(hash: unknown): `0x${string}` {
  if (typeof hash !== 'string' || !hash.startsWith('0x')) {
    throw new Error(
      `Received an invalid hash on signing the transaction. (hash=${String(
        hash
      )})`
    );
  }
  return hash as `0x${string}`;
}

/**
 * Sends a transaction from Rango's API through the wallet's EVM namespace.
 */
export async function sendEvmTransaction(
  namespace: EvmNamespace,
  tx: EvmTransaction,
  address: string,
  chainId: string | null
): Promise<{ hash: string }> {
  if (!('sendTransaction' in namespace)) {
    throw SignerError.UnsupportedError('executeEvmTransaction');
  }

  try {
    await assertWalletMatches(namespace, address, chainId);

    try {
      const hash = await namespace.sendTransaction(
        toEvmTransactionRequest(tx, address)
      );
      return { hash: assertTransactionHash(hash) };
    } catch (error) {
      // Some wallets reject EIP-1559 fees, retry with a legacy gas price.
      if (errorChainIncludes(error, 'EIP-1559')) {
        console.log('retrying EIP-1559 error without v2 fields ...');
        const hash = await namespace.sendTransaction(
          toEvmTransactionRequest(tx, address, { legacyGas: true })
        );
        return { hash: assertTransactionHash(hash) };
      }
      throw error;
    }
  } catch (error) {
    throw toEvmSignerError(error);
  }
}

/**
 * Signs EIP-712 typed data through the wallet's EVM namespace.
 */
export async function signEvmTypedData(
  namespace: EvmNamespace,
  typedData: TypedDataDefinition,
  address: string
): Promise<`0x${string}`> {
  try {
    return await namespace.signTypedData({
      ...typedData,
      account: address as `0x${string}`,
    });
  } catch (error) {
    throw toEvmSignerError(error, SignerErrorCode.SIGN_TX_ERROR);
  }
}

interface TenderlyResponse {
  error_message: string;
}

async function getTenderlyError(
  chainId: string | undefined,
  txHash: string
): Promise<string | undefined> {
  if (!chainId || !txHash) {
    return;
  }
  try {
    const url = `https://api.tenderly.co/api/v1/public-contract/${parseInt(
      chainId
    )}/tx/${txHash}`;
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      return;
    }
    const data: TenderlyResponse = await response.json();
    return data?.error_message;
  } catch {
    return;
  }
}

function hasResolveTransactionHash(namespace: EvmNamespace): boolean {
  return RESOLVE_TRANSACTION_HASH_ACTION in namespace;
}

/**
 * Waits for a sent EVM transaction to be mined, following it if it gets
 * replaced. Returns the hash to track it by, which differs from `hash` when the
 * wallet returned another kind of hash or the transaction was replaced.
 *
 * Only a cancelled transaction, or one that reverted for a reason Tenderly can
 * give, throws. Anything else is left to the backend's status check.
 */
export async function waitForEvmTransaction(
  namespace: EvmNamespace,
  hash: string,
  chainId: string | undefined
): Promise<{ hash: string }> {
  let txHash = hash;

  try {
    if (hasResolveTransactionHash(namespace)) {
      const resolveTransactionHash = (
        namespace as unknown as Record<string, ResolveTransactionHash>
      )[RESOLVE_TRANSACTION_HASH_ACTION];
      txHash = await resolveTransactionHash(hash);
    }

    /*
     * The receipt is read through the wallet, which only sees the chain it's on.
     * If the user has switched networks in the meantime, leave it to the
     * backend's status check.
     */
    const [getState] = namespace.state();
    if (!getState('connected') || !chainId) {
      return { hash: txHash };
    }
    const walletChainId = await namespace.getChainId();
    if (
      Number(walletChainId) !== Number(chainId) ||
      !('waitForTransactionReceipt' in namespace)
    ) {
      return { hash: txHash };
    }

    let replacementReason: string | undefined;
    const receipt = await namespace.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
      onReplaced: (replacement) => {
        replacementReason = replacement.reason;
      },
    });

    if (replacementReason === 'cancelled') {
      throw new SignerError(
        SignerErrorCode.SEND_TX_ERROR,
        undefined,
        'Transaction replaced and canceled by user'
      );
    }

    if (receipt.status === 'reverted') {
      const tenderlyError = await getTenderlyError(
        chainId,
        receipt.transactionHash
      );
      if (tenderlyError) {
        throw new SignerError(
          SignerErrorCode.TX_FAILED_IN_BLOCKCHAIN,
          'Transaction failed in blockchain',
          tenderlyError,
          RPCErrorCode.CALL_EXCEPTION
        );
      }
    }

    return { hash: receipt.transactionHash };
  } catch (error) {
    if (SignerError.isSignerError(error)) {
      throw error;
    }
    /*
     * RPCs sometimes fail even when the transaction succeeded, so other errors
     * are ignored and the status check carries on.
     */
    return { hash: txHash };
  }
}
