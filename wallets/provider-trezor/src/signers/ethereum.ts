import type { EvmTransaction } from 'rango-types/lib/api/main';

import { DEFAULT_ETHEREUM_RPC_URL } from '@rango-dev/wallets-shared';
import { JsonRpcProvider, Transaction } from 'ethers';
import { type GenericSigner } from 'rango-types';

import {
  ETHEREUM_BIP32_PATH,
  getTrezorErrorMessage,
  valueToHex,
} from '../helpers';

export class EthereumSigner implements GenericSigner<EvmTransaction> {
  async signMessage(msg: string): Promise<string> {
    const { default: TrezorConnect } = await import('@trezor/connect-web');

    const { success, payload } = await TrezorConnect.signMessage({
      message: msg,
      path: ETHEREUM_BIP32_PATH,
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
      const { default: TrezorConnect } = await import('@trezor/connect-web');
      const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = tx;
      const isEIP1559 = maxFeePerGas && maxPriorityFeePerGas;

      if (isEIP1559 && !maxFeePerGas) {
        throw new Error('Missing maxFeePerGas');
      }
      if (isEIP1559 && !maxPriorityFeePerGas) {
        throw new Error('Missing maxPriorityFeePerGas');
      }
      if (!isEIP1559 && !gasPrice) {
        throw new Error('Missing gasPrice');
      }
      const provider = new JsonRpcProvider(DEFAULT_ETHEREUM_RPC_URL); // Provider to broadcast transaction
      const transactionCount = await provider.getTransactionCount(fromAddress); // Get nonce
      const additionalFields = isEIP1559
        ? {
            maxFeePerGas: valueToHex(maxFeePerGas || '0'),
            maxPriorityFeePerGas: valueToHex(maxPriorityFeePerGas || '0'),
          }
        : {
            gasPrice: valueToHex(gasPrice || '0'),
          };

      const transaction = {
        to: tx.to,
        data: tx.data || '0x',
        value: valueToHex(tx.value?.toString() || '0'),
        gasLimit: valueToHex(tx.gasLimit?.toString() || '0'),
        chainId: Number.parseInt(chainId),
        nonce: valueToHex(transactionCount.toString()),
        ...additionalFields,
      };

      const { success, payload } = await TrezorConnect.ethereumSignTransaction({
        path: ETHEREUM_BIP32_PATH,
        transaction,
      });
      if (!success) {
        throw new Error(payload.error);
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
