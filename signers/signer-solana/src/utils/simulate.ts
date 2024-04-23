import type { Transaction, VersionedTransaction } from '@solana/web3.js';

import { SignerError, SignerErrorCode } from 'rango-types';

import { getSolanaConnection } from './helpers';

export async function simulateTransaction(
  tx: Transaction | VersionedTransaction,
  type: 'VERSIONED' | 'LEGACY'
) {
  if (type === 'VERSIONED') {
    const connection = getSolanaConnection();

    // We first simulate whether the transaction would be successful
    const { value: simulatedTransactionResponse } =
      await connection.simulateTransaction(tx as VersionedTransaction, {
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
}
