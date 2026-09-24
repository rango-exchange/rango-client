import type { FeeData } from 'ethers';
import type { EvmTransaction } from 'rango-types/mainApi';

import {
  cleanEvmError,
  DEFAULT_ETHEREUM_RPC_URL,
  toHexQuantity,
} from '@rango-dev/signer-evm';
import { JsonRpcProvider, Transaction } from 'ethers';
import { type GenericSigner } from 'rango-types';

import { getDerivationPath } from '../state.js';
import { getTrezorModule, trezorErrorMessages } from '../utils.js';

/** Whether a transaction already prices itself under either scheme. */
function hasGasPricing(tx: EvmTransaction): boolean {
  return !!tx.gasPrice || (!!tx.maxFeePerGas && !!tx.maxPriorityFeePerGas);
}

/**
 * Picks one pricing scheme from what the node quotes. The two are mutually
 * exclusive in a signed transaction, so EIP-1559 is used wherever the chain
 * quotes it and a legacy price is the fallback.
 */
function pricingFromFeeData(fees: FeeData) {
  if (fees.maxFeePerGas && fees.maxPriorityFeePerGas) {
    return {
      gasPrice: null,
      maxFeePerGas: fees.maxFeePerGas.toString(),
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas.toString(),
    };
  }

  return {
    gasPrice: fees.gasPrice?.toString() ?? null,
    maxFeePerGas: null,
    maxPriorityFeePerGas: null,
  };
}

export function getTrezorErrorMessage(error: unknown) {
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
  return cleanEvmError(error);
}

export class EthereumSigner implements GenericSigner<EvmTransaction> {
  async signMessage(msg: string): Promise<string> {
    const TrezorConnect = await getTrezorModule();

    const { success, payload } = await TrezorConnect.ethereumSignMessage({
      message: msg,
      path: getDerivationPath(),
    });
    if (!success) {
      throw new Error(payload.error);
    }
    return payload.signature;
  }

  async signAndSendTx(
    tx: EvmTransaction,
    fromAddress: string,
    chainId: string
  ): Promise<{ hash: string }> {
    try {
      const TrezorConnect = await getTrezorModule();
      const provider = new JsonRpcProvider(DEFAULT_ETHEREUM_RPC_URL); // Provider to broadcast transaction
      const transactionCount = await provider.getTransactionCount(fromAddress); // Get nonce

      /*
       * Trezor signs a raw transaction on-device and does not estimate gas, so
       * a limit has to be present. Server-built transactions arrive with one;
       * client-built ones - approve prerequisites among them - do not, so it is
       * estimated here. Everything else is taken as the transaction sends it.
       */
      const gasLimit =
        tx.gasLimit ??
        (
          await provider.estimateGas({
            from: fromAddress,
            to: tx.to,
            data: tx.data ?? undefined,
            value: tx.value ?? undefined,
          })
        ).toString();
      /*
       * Whatever pricing the transaction came with wins - a server-built one
       * always carries it, and it is signed with exactly what it was created
       * with. Only a client-built transaction, which leaves both schemes null,
       * is priced from the node.
       */
      const pricing = hasGasPricing(tx)
        ? {
            gasPrice: tx.gasPrice,
            maxFeePerGas: tx.maxFeePerGas,
            maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
          }
        : pricingFromFeeData(await provider.getFeeData());

      const isEIP1559 =
        !!pricing.maxFeePerGas && !!pricing.maxPriorityFeePerGas;

      if (!isEIP1559 && !pricing.gasPrice) {
        throw new Error('Missing gasPrice');
      }

      const additionalFields = isEIP1559
        ? {
            maxFeePerGas: toHexQuantity(pricing.maxFeePerGas || '0'),
            maxPriorityFeePerGas: toHexQuantity(
              pricing.maxPriorityFeePerGas || '0'
            ),
          }
        : {
            gasPrice: toHexQuantity(pricing.gasPrice || '0'),
          };

      const transaction = {
        to: tx.to,
        data: tx.data || '0x',
        value: toHexQuantity(tx.value?.toString() || '0'),
        gasLimit: toHexQuantity(gasLimit),
        chainId: Number.parseInt(chainId),
        nonce: toHexQuantity(transactionCount.toString()),
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
      }).serialized;
      const broadcastResult = await provider.broadcastTransaction(serializedTx);

      return { hash: broadcastResult.hash };
    } catch (error) {
      throw getTrezorErrorMessage(error);
    }
  }
}
