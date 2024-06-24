import type { EvmTransaction } from 'rango-types/lib/api/main';

import { RPC_PROVIDER_URL } from '@rango-dev/wallets-shared';
import TrezorConnect from '@trezor/connect-web';
import { JsonRpcProvider } from 'ethers';
import { type GenericSigner } from 'rango-types';

import { ETH_BIP32_PATH, toHexString } from '../helpers';

export class EthereumSigner implements GenericSigner<EvmTransaction> {
  async signMessage(msg: string): Promise<string> {
    try {
      const { success, payload } = await TrezorConnect.signMessage({
        message: msg,
        path: ETH_BIP32_PATH,
      });
      if (!success) {
        throw new Error(payload.error);
      }
      return payload.signature;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async signAndSendTx(
    tx: EvmTransaction,
    fromAddress: string,
    chainId: string
  ): Promise<{ hash: string }> {
    try {
      const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = tx;
      const isEIP1559 = maxFeePerGas && maxPriorityFeePerGas;

      if (isEIP1559 && !maxFeePerGas) {
        throw new Error('Missing maxFeePerGas');
      }
      if (isEIP1559 && !maxPriorityFeePerGas) {
        throw new Error('Missing maxFeePerGas');
      }
      if (!(isEIP1559 || gasPrice)) {
        throw new Error('Missing gasPrice');
      }
      console.log({ tx });

      const provider = new JsonRpcProvider(RPC_PROVIDER_URL); // Provider to broadcast transaction
      const transactionCount = await provider.getTransactionCount(fromAddress); // Get nonce

      const additionalFields = isEIP1559
        ? {
            maxFeePerGas: toHexString(BigInt(maxFeePerGas || 0)),
            maxPriorityFeePerGas: toHexString(
              BigInt(maxPriorityFeePerGas || 0)
            ),
          }
        : (gasPrice && {
            gasPrice: toHexString(BigInt(gasPrice || 0)),
          }) || {
            gasPrice: '0x0',
          };

      console.log({ additionalFields });

      const transaction: any = {
        to: tx.to,
        data: tx.data,
        value: toHexString(BigInt(tx.value?.toString() || 0)),
        gasLimit: toHexString(BigInt(tx.gasLimit?.toString() || 0)),
        chainId: Number.parseInt(chainId),
        nonce: transactionCount.toString(),
        ...additionalFields,
      };
      const { success, payload } = await TrezorConnect.ethereumSignTransaction({
        path: ETH_BIP32_PATH,
        transaction,
      });

      if (!success) {
        throw new Error(payload.error);
      }
      const { serializedTx } = payload;

      if (!serializedTx) {
        throw new Error('Failed to sign transaction');
      }
      const broadcastResult = await provider.broadcastTransaction(serializedTx);

      return { hash: broadcastResult.hash };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
