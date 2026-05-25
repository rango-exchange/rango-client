import { signMessage, signTransaction } from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';
import {
  type GenericSigner,
  SignerError,
  SignerErrorCode,
  type StellarTransaction,
} from 'rango-types';

import { HORIZON_URL, NETWORK_PASSPHRASE, RPC_URL } from '../../constants.js';

export const BASE_FEE = '100';

const SOROBAN_OP_TYPES = [
  'invokeHostFunction',
  'restoreFootprint',
  'extendFootprintTtl',
];

export class Signer implements GenericSigner<StellarTransaction> {
  static async buildXdrTransaction(
    tx: StellarTransaction,
    address: string
  ): Promise<string> {
    const server = new StellarSdk.Horizon.Server(HORIZON_URL);
    const account = await server.loadAccount(address);

    const builder = new StellarSdk.TransactionBuilder(account, {
      networkPassphrase: NETWORK_PASSPHRASE,
      fee: tx.data.baseFee ?? BASE_FEE,
      timebounds: tx.data.preconditions.timeBounds,
      ledgerbounds: tx.data.preconditions.ledgerBounds,
      minAccountSequence: tx.data.preconditions.minSeqNumber ?? undefined,
      minAccountSequenceAge: tx.data.preconditions.minSeqAge ?? undefined,
      minAccountSequenceLedgerGap:
        tx.data.preconditions.minSeqLedgerGap ?? undefined,
      extraSigners: tx.data.preconditions.extraSigners ?? undefined,
    });

    if (tx.data.memoXdrBase64) {
      const memoXDRObject = StellarSdk.xdr.Memo.fromXDR(
        tx.data.memoXdrBase64,
        'base64'
      );
      builder.addMemo(StellarSdk.Memo.fromXDRObject(memoXDRObject));
    }

    for (const operationXdrBase64 of tx.data.operationsXdrBase64) {
      const operationXDRObject = StellarSdk.xdr.Operation.fromXDR(
        operationXdrBase64,
        'base64'
      );
      builder.addOperation(operationXDRObject);
    }

    const transaction = builder.build();

    const isSorobanTransaction = transaction.operations.some((operation) =>
      SOROBAN_OP_TYPES.includes(operation.type)
    );

    if (isSorobanTransaction) {
      const rpcServer = new StellarSdk.rpc.Server(RPC_URL);
      const preparedTransaction = await rpcServer.prepareTransaction(
        transaction
      );
      const xdrTransaction = preparedTransaction.toXDR();
      return xdrTransaction;
    }

    const xdrTransaction = transaction.toXDR();

    return xdrTransaction;
  }

  async signMessage(msg: string): Promise<string> {
    const signature = await signMessage(msg);

    if (!signature.signedMessage) {
      throw new Error(signature.error);
    }

    if (typeof signature.signedMessage === 'string') {
      return signature.signedMessage;
    }

    return signature.signedMessage.toString('hex');
  }

  async signAndSendTx(
    tx: StellarTransaction,
    address: string
  ): Promise<{ hash: string }> {
    const server = new StellarSdk.Horizon.Server(HORIZON_URL);

    const xdrTransaction = await Signer.buildXdrTransaction(tx, address);

    const signature = await signTransaction(xdrTransaction);

    if (signature.error) {
      throw new SignerError(
        SignerErrorCode.SIGN_TX_ERROR,
        undefined,
        signature.error
      );
    }

    const signedTransaction = new StellarSdk.Transaction(
      signature.signedTxXdr,
      NETWORK_PASSPHRASE
    );

    const result = await server.submitTransaction(signedTransaction);

    if (!result.successful) {
      throw new SignerError(
        SignerErrorCode.SIGN_TX_ERROR,
        'Error submitting transaction',
        undefined
      );
    }

    return { hash: result.hash };
  }
}
