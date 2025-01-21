import type {
  ConnectionPool,
  SolanaExternalProvider,
  SolanaWeb3Signer,
} from './types.js';
import type { SolanaTransaction } from 'rango-types';

import { SignerError, SignerErrorCode } from 'rango-types';

import { getSolanaConnection, getSolanaRpcNodes } from './helpers.js';
import { prepareTransaction } from './prepare.js';
import { transactionSenderAndConfirmationWaiter } from './send.js';
import { simulateTransaction } from './simulate.js';

/*
 * https://docs.phantom.app/integrating/sending-a-transaction
 * https://station.jup.ag/docs/apis/troubleshooting
 */
export const generalSolanaTransactionExecutor = async (
  tx: SolanaTransaction,
  DefaultSolanaSigner: SolanaWeb3Signer
): Promise<string> => {
  const connection = getSolanaConnection(getSolanaRpcNodes().main);
  const latestBlock = await connection.getLatestBlockhash('confirmed');

  const finalTx = prepareTransaction(tx, latestBlock.blockhash);
  const serializedTransaction = await DefaultSolanaSigner(finalTx);

  // We first simulate whether the transaction would be successful
  await simulateTransaction(finalTx, tx.txType);

  const connectionPool: ConnectionPool = {
    main: connection,
    list: getSolanaRpcNodes().list.map((url) => getSolanaConnection(url)),
  };

  const { txId, txResponse } = await transactionSenderAndConfirmationWaiter({
    connectionPool,
    serializedTransaction,
  });
  if (!txId || !txResponse) {
    throw new SignerError(
      SignerErrorCode.SEND_TX_ERROR,
      undefined,
      'Error confirming the transaction'
    );
  }
  return txId;
};

export async function executeSolanaTransaction(
  tx: SolanaTransaction,
  solanaProvider: SolanaExternalProvider
): Promise<string> {
  const DefaultSolanaSigner: SolanaWeb3Signer = async (
    solanaWeb3Transaction
  ) => {
    if (!solanaProvider.publicKey) {
      throw new SignerError(
        SignerErrorCode.SIGN_TX_ERROR,
        'Please make sure the required account is connected properly.'
      );
    }

    if (tx.from !== solanaProvider.publicKey?.toString()) {
      throw new SignerError(
        SignerErrorCode.SIGN_TX_ERROR,
        `Your connected account doesn't match with the required account. Please ensure that you are connected with the correct account and try again.`
      );
    }

    try {
      const signedTransaction = await solanaProvider.signTransaction(
        solanaWeb3Transaction
      );
      return signedTransaction.serialize();
    } catch (e: any) {
      const REJECTION_CODE = 4001;
      if (e && Object.hasOwn(e, 'code') && e.code === REJECTION_CODE) {
        throw new SignerError(SignerErrorCode.REJECTED_BY_USER, undefined, e);
      }
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, e);
    }
  };
  return await generalSolanaTransactionExecutor(tx, DefaultSolanaSigner);
}
