import type { Context, FunctionWithContext } from '@hub3js/core';
import type { EvmActions } from '@hub3js/evm';

import { Transaction } from 'ethers';

import { ETHEREUM_CHAIN_ID } from '../constants.js';
import { getDerivationPath } from '../state.js';
import { getTrezorModule, trezorErrorMessages } from '../utils.js';

type Pricing = {
  gasPrice: bigint | null;
  maxFeePerGas: bigint | null;
  maxPriorityFeePerGas: bigint | null;
};

const ZERO = BigInt(0);

const HEXADECIMAL_BASE = 16;

/** TrezorConnect parses quantities as hex. */
const toHexQuantity = (value: bigint | number): string =>
  `0x${value.toString(HEXADECIMAL_BASE)}`;

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

function getTrezorErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'shortMessage' in error &&
    typeof error.shortMessage === 'string'
  ) {
    /*
     * Some error signs have lengthy, challenging-to-read messages.
     * shortMessage is used because it is shorter and easier to understand.
     */
    return new Error(error.shortMessage, { cause: error });
  }
  return error;
}

export const signMessage: FunctionWithContext<
  EvmActions['signMessage'],
  Context<EvmActions>
> = async (_context, params) => {
  const message = params?.message;
  if (typeof message !== 'string') {
    throw new Error('Trezor can only sign text messages.');
  }

  const TrezorConnect = await getTrezorModule();

  const { success, payload } = await TrezorConnect.ethereumSignMessage({
    message,
    path: getDerivationPath(),
  });
  if (!success) {
    throw new Error(payload.error);
  }
  return payload.signature as `0x${string}`;
};

/**
 * Trezor has no injected provider: the transaction is completed through the
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
    const TrezorConnect = await getTrezorModule();

    const nonce =
      request.nonce ??
      ((await context.action('getTransactionCount', {
        address: from,
      })) as number);

    /*
     * Trezor signs a raw transaction on-device and does not estimate gas, so
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

    const isEIP1559 = !!pricing.maxFeePerGas && !!pricing.maxPriorityFeePerGas;

    if (!isEIP1559 && !pricing.gasPrice) {
      throw new Error('Missing gasPrice');
    }

    const additionalFields = isEIP1559
      ? {
          maxFeePerGas: toHexQuantity(pricing.maxFeePerGas ?? ZERO),
          maxPriorityFeePerGas: toHexQuantity(
            pricing.maxPriorityFeePerGas ?? ZERO
          ),
        }
      : {
          gasPrice: toHexQuantity(pricing.gasPrice ?? ZERO),
        };

    const transaction = {
      to: to ?? null,
      data: data ?? '0x',
      value: toHexQuantity(value ?? ZERO),
      gasLimit: toHexQuantity(gasLimit),
      chainId: Number(ETHEREUM_CHAIN_ID),
      nonce: toHexQuantity(nonce),
      ...additionalFields,
    };

    const { success, payload } = await TrezorConnect.ethereumSignTransaction({
      path: getDerivationPath(),
      transaction,
    });

    if (!success) {
      const errorMessage =
        trezorErrorMessages[payload?.code || ''] || payload.error;
      throw new Error(errorMessage);
    }
    const { r, s, v } = payload;

    const serializedTx = Transaction.from({
      ...transaction,
      nonce: Number.parseInt(transaction.nonce),
      /*
       * Type 0: This refers to the legacy transaction type that has been used since Ethereum's inception.
       * Type 2: This refers to the new transaction type introduced with the EIP-1559 (Ethereum Improvement Proposal 1559) update,
       * which was part of the London hard fork.
       */
      type: isEIP1559 ? 2 : 0,
      signature: { r, s, v: parseInt(v) },
    }).serialized as `0x${string}`;

    return (await context.action('sendRawTransaction', {
      serializedTransaction: serializedTx,
    })) as `0x${string}`;
  } catch (error) {
    throw getTrezorErrorMessage(error);
  }
};
