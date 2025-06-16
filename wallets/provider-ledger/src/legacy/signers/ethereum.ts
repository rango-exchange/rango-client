import type { TransactionLike } from 'ethers';
import type { GenericSigner } from 'rango-types';
import type { EvmTransaction } from 'rango-types/mainApi';

import Eth, { ledgerService } from '@ledgerhq/hw-app-eth';
import { DEFAULT_ETHEREUM_RPC_URL } from '@rango-dev/wallets-shared';
import { JsonRpcProvider, Transaction } from 'ethers';
import { SignerError, SignerErrorCode } from 'rango-types';

import { getDerivationPath } from '../../state.js';
import {
  getLedgerError,
  transportConnect,
  transportDisconnect,
} from '../../utils.js';

export class EthereumSigner implements GenericSigner<EvmTransaction> {
  async signMessage(msg: string): Promise<string> {
    try {
      const transport = await transportConnect();

      const eth = new Eth(transport);
      const result = await eth.signPersonalMessage(
        getDerivationPath(),
        Buffer.from(msg).toString('hex')
      );
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      let v = (result['v'] - 27).toString(16);
      if (v.length < 2) {
        v = '0' + v;
      }
      return '0x' + result['r'] + result['s'] + v;
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }

  async signAndSendTx(
    tx: EvmTransaction,
    fromAddress: string,
    chainId: string | null
  ): Promise<{ hash: string }> {
    try {
      const provider = new JsonRpcProvider(DEFAULT_ETHEREUM_RPC_URL); // Provider to broadcast transaction

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

      const resolution = await ledgerService.resolveTransaction(
        unsignedTx,
        {},
        {}
      ); // metadata necessary to allow the device to clear sign information

      const transport = await transportConnect();

      const eth = new Eth(transport);

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
