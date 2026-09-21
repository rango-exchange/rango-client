import type { ExecuteHooks, SendResult } from './types';
import type { ActionContext } from '../../context';
import type { SwapExecution } from '../../types';
import type { EvmTransaction, HyperliquidTransaction } from 'rango-sdk';
import type { EvmBlockchainMeta } from 'rango-types';

import { isEvmBlockchain, TransactionType } from 'rango-types';

import { ActionError } from '../../../errors';
import { ensureEvmEnvironment } from '../environment/mod';
import {
  HYPERLIQUID_SUPPORTED_ACTIONS,
  parseTypedData,
  splitSignature,
  submitAction,
} from '../hyperliquid/mod';
import { isSameChainId } from '../meta';
import { getSigner, signTypedData } from '../signer';

/**
 * Runs a Hyperliquid user action: the wallet signs the API's EIP-712 message
 * and the signature goes to the exchange, which returns no hash. The hash is
 * looked up afterwards by `find_transaction_hash`, so this reports the
 * transaction as submitted rather than sent.
 *
 * The message is signed with the EVM signer on the chain the action names in
 * `signatureChainId`, which is not the transaction's own chain: the wallet is
 * stored under Hyperliquid, but has to be on that EVM chain, since wallets
 * refuse typed data whose domain names another chain.
 */
export async function executeHyperliquidTransaction(
  exec: SwapExecution,
  context: ActionContext,
  tx: HyperliquidTransaction,
  hooks: ExecuteHooks = {}
): Promise<SendResult> {
  if (!HYPERLIQUID_SUPPORTED_ACTIONS.includes(tx.action.type)) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `Hyperliquid action ${tx.action.type} is not supported`
    );
  }
  if (!tx.message) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      'The Hyperliquid transaction carries no message to sign'
    );
  }

  const signChain = findSignChain(context, tx.action.signatureChainId);
  const { wallet, provider } = await ensureEvmEnvironment(
    exec,
    context,
    tx.blockChain,
    { network: signChain.name }
  );
  const signer = await getSigner<EvmTransaction>(provider, TransactionType.EVM);
  const typedData = parseTypedData(tx.message);

  await hooks.beforeSign?.();
  const signature = await signTypedData(
    signer,
    typedData,
    wallet.address,
    tx.action.signatureChainId
  );
  await submitAction(tx.action, splitSignature(signature), tx.nonce);

  return { hash: null };
}

/** The EVM chain of meta the action is signed on, by the chain id the action names. */
function findSignChain(
  context: ActionContext,
  chainId: string
): EvmBlockchainMeta {
  const chain = context
    .getMeta()
    .blockchains.filter(isEvmBlockchain)
    .find((blockchain) => isSameChainId(blockchain.chainId, chainId));

  if (!chain) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `No EVM chain in the host's meta has chain id ${chainId}, which the Hyperliquid action is signed on`
    );
  }
  return chain;
}
