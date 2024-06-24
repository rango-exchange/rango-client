import type { EvmTransaction } from 'rango-types/lib/api/main';

import TrezorConnect from '@trezor/connect-web';
import { JsonRpcProvider } from 'ethers';
import { type GenericSigner } from 'rango-types';

import { ETH_BIP32_PATH } from '../helpers';

export const RPC_PROVIDER_URL = 'https://rpc.ankr.com/eth';

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
      const provider = new JsonRpcProvider(RPC_PROVIDER_URL); // Provider to broadcast transaction
      const transactionCount = await provider.getTransactionCount(fromAddress); // Get nonce

      const transaction: any = {
        ...tx,
        chainId: Number.parseInt(chainId),
        nonce: transactionCount.toString(),
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
