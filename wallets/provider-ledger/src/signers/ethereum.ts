import type { TransactionLike } from 'ethers';
import type { GenericSigner } from 'rango-types';
import type { EvmTransaction } from 'rango-types/lib/api/main';

import { JsonRpcProvider, Transaction } from 'ethers';
import { SignerError } from 'rango-types';

import {
  getLedgerError,
  transportConnect,
  transportDisconnect,
} from '../helpers';
import { getDerivationPath } from '../state';

export const RPC_PROVIDER_URL = 'https://rpc.ankr.com/eth';

export class EthereumSigner implements GenericSigner<EvmTransaction> {
  async signMessage(): Promise<string> {
    // TODO: Should be implemented using eth.signPersonalMessage
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(
    tx: EvmTransaction,
    fromAddress: string,
    chainId: string | null
  ): Promise<{ hash: string }> {
    try {
      const provider = new JsonRpcProvider(RPC_PROVIDER_URL); // Provider to broadcast transaction

      const transactionCount = await provider.getTransactionCount(fromAddress); // Get nonce

      const transaction: TransactionLike<string> = {
        to: tx.to,
        gasPrice: tx.gasPrice,
        gasLimit: tx.gasLimit,
        nonce: transactionCount,
        chainId: chainId,
        data: tx.data,
        value: tx.value,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
        maxFeePerGas: tx.maxFeePerGas,
      };

      const unsignedTx =
        Transaction.from(transaction).unsignedSerialized.substring(2); // Create unsigned transaction

      const resolution = await (
        await import('@ledgerhq/hw-app-eth')
      ).ledgerService.resolveTransaction(unsignedTx, {}, {}); // metadata necessary to allow the device to clear sign information

      const transport = await transportConnect();

      const eth = new (await import('@ledgerhq/hw-app-eth')).default(transport);

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
      }).serialized;

      const broadcastResult = await provider.broadcastTransaction(signedTx);

      return { hash: broadcastResult.hash };
    } catch (error) {
      throw getLedgerError(error);
    } finally {
      await transportDisconnect();
    }
  }
}
