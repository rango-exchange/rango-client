import type { Context, FunctionWithContext } from '@hub3js/core';
import type { EvmActions } from '@hub3js/evm';
import type { TransactionLike } from 'ethers';

import { Transaction } from 'ethers';
import { SignerError, SignerErrorCode } from 'rango-types';

import { ETHEREUM_CHAIN_ID } from '../constants.js';
import { getDerivationPath } from '../state.js';
import {
  getLedgerError,
  transportConnect,
  transportDisconnect,
} from '../utils.js';

type Pricing = {
  gasPrice: bigint | null;
  maxFeePerGas: bigint | null;
  maxPriorityFeePerGas: bigint | null;
};

const ZERO = BigInt(0);

function getAddress(account: unknown): `0x${string}` {
  if (typeof account === 'string') {
    return account as `0x${string}`;
  }
  return (account as { address: `0x${string}` }).address;
}

/**
 * Picks one pricing scheme from what the node quotes. The two are mutually
 * exclusive in a signed transaction, so EIP-1559 is used wherever the chain
 * quotes it and a legacy price is the fallback.
 */
async function getPricingFromNode(
  context: Context<EvmActions>
): Promise<Pricing> {
  try {
    const fees = (await context.action('estimateFeesPerGas')) as {
      maxFeePerGas: bigint;
      maxPriorityFeePerGas: bigint;
    };
    return {
      gasPrice: null,
      maxFeePerGas: fees.maxFeePerGas,
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
    };
  } catch {
    return {
      gasPrice: (await context.action('getGasPrice')) as bigint,
      maxFeePerGas: null,
      maxPriorityFeePerGas: null,
    };
  }
}

export const signMessage: FunctionWithContext<
  EvmActions['signMessage'],
  Context<EvmActions>
> = async (_context, params) => {
  const message = params?.message;
  if (typeof message !== 'string') {
    throw new SignerError(
      SignerErrorCode.SIGN_TX_ERROR,
      undefined,
      'Ledger can only sign text messages.'
    );
  }

  try {
    const transport = await transportConnect();
    const LedgerAppEth = (await import('@ledgerhq/hw-app-eth')).default;
    const eth = new LedgerAppEth(transport);

    const result = await eth.signPersonalMessage(
      getDerivationPath(),
      Buffer.from(message).toString('hex')
    );
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    let v = (result['v'] - 27).toString(16);
    if (v.length < 2) {
      v = '0' + v;
    }
    return `0x${result['r']}${result['s']}${v}`;
  } catch (error) {
    throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
  }
};

/**
 * Ledger has no injected provider: the transaction is completed through the
 * namespace's public client, signed on the device, then broadcast.
 */
export const sendTransaction: FunctionWithContext<
  EvmActions['sendTransaction'],
  Context<EvmActions>
> = async (context, request) => {
  if (!request) {
    throw new Error('A transaction is required.');
  }
  const from = getAddress(request.account);
  const { to, data, value } = request;

  try {
    const nonce =
      request.nonce ??
      ((await context.action('getTransactionCount', {
        address: from,
      })) as number);

    /*
     * Ledger signs a raw transaction on-device and does not estimate gas, so
     * a limit has to be present. Server-built transactions arrive with one;
     * client-built ones - approve prerequisites among them - do not, so it is
     * estimated here. Everything else is taken as the transaction sends it.
     */
    const gasLimit =
      request.gas ??
      ((await context.action('estimateGas', {
        account: from,
        to,
        data,
        value,
      })) as bigint);

    /*
     * Whatever pricing the transaction came with wins - a server-built one
     * always carries it, and it is signed with exactly what it was created
     * with. Only a client-built transaction, which leaves both schemes null,
     * is priced from the node.
     */
    const hasPricing =
      !!request.gasPrice ||
      (!!request.maxFeePerGas && !!request.maxPriorityFeePerGas);
    const pricing: Pricing = hasPricing
      ? {
          gasPrice: request.gasPrice ?? null,
          maxFeePerGas: request.maxFeePerGas ?? null,
          maxPriorityFeePerGas: request.maxPriorityFeePerGas ?? null,
        }
      : await getPricingFromNode(context);

    const transaction: TransactionLike<string> = {
      to: to ?? null,
      gasPrice: pricing.gasPrice,
      gasLimit,
      nonce,
      chainId: ETHEREUM_CHAIN_ID,
      data: data ?? '0x',
      value: value ?? ZERO,
      maxPriorityFeePerGas: pricing.maxPriorityFeePerGas,
      maxFeePerGas: pricing.maxFeePerGas,
    };

    const unsignedTx =
      Transaction.from(transaction).unsignedSerialized.substring(2); // Create unsigned transaction

    const transport = await transportConnect();
    const LedgerHqAppEth = await import('@ledgerhq/hw-app-eth');

    const LedgerAppEth = LedgerHqAppEth.default;
    const eth = new LedgerAppEth(transport);

    const resolution = await LedgerHqAppEth.ledgerService.resolveTransaction(
      unsignedTx,
      {},
      {}
    ); // metadata necessary to allow the device to clear sign information
    const signature = await eth.signTransaction(
      getDerivationPath(),
      unsignedTx,
      resolution
    );

    const signedTx = Transaction.from({
      ...transaction,
      signature: {
        r: '0x' + signature.r,
        s: '0x' + signature.s,
        v: parseInt(signature.v),
      },
    }).serialized as `0x${string}`;

    return (await context.action('sendRawTransaction', {
      serializedTransaction: signedTx,
    })) as `0x${string}`;
  } catch (error) {
    throw getLedgerError(error);
  } finally {
    await transportDisconnect();
  }
};
