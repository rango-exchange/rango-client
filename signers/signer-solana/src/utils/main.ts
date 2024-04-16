import type { SolanaExternalProvider, SolanaWeb3Signer } from './types';
import type { VersionedTransaction } from '@solana/web3.js';
import type { SolanaTransaction } from 'rango-types';

import { SignerError, SignerErrorCode } from 'rango-types';

import { getSolanaConnection } from './helpers';
import { prepareTransaction } from './prepare';
import { transactionSenderAndConfirmationWaiter } from './send';

/*
 * https://docs.phantom.app/integrating/sending-a-transaction
 * https://station.jup.ag/docs/apis/troubleshooting
 */
export const generalSolanaTransactionExecutor = async (
  tx: SolanaTransaction,
  DefaultSolanaSigner: SolanaWeb3Signer
): Promise<string> => {
  const connection = getSolanaConnection();
  const latestBlock = await connection.getLatestBlockhash('confirmed');

  const finalTx = prepareTransaction(tx, latestBlock.blockhash);
  const raw = await DefaultSolanaSigner(finalTx);

  // We first simulate whether the transaction would be successful
  if (tx.txType === 'VERSIONED') {
    const { value: simulatedTransactionResponse } =
      await connection.simulateTransaction(finalTx as VersionedTransaction, {
        replaceRecentBlockhash: true,
        commitment: 'processed',
      });
    const { err, logs } = simulatedTransactionResponse;
    if (err) {
      /*
       * Simulation error, we can check the logs for more details
       * If you are getting an invalid account error, make sure that you have the input mint account to actually swap from.
       */
      console.error('Simulation Error:', { err, logs });
      const message =
        (logs?.length || 0) > 0
          ? logs?.[logs?.length - 1]
          : JSON.stringify(err);

      throw new SignerError(
        SignerErrorCode.SEND_TX_ERROR,
        undefined,
        `Simulation failed: ${message}`
      );
    }
  }

  const serializedTransaction = Buffer.from(raw);
  const { txId, txResponse } = await transactionSenderAndConfirmationWaiter({
    connection,
    serializedTransaction,
    blockhashWithExpiryBlockHeight: {
      blockhash: latestBlock.blockhash,
      lastValidBlockHeight: latestBlock.lastValidBlockHeight,
    },
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
    const signedTransaction = await solanaProvider.signTransaction(
      solanaWeb3Transaction
    );
    return signedTransaction.serialize();
  };
  return await generalSolanaTransactionExecutor(tx, DefaultSolanaSigner);
}
