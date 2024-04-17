import type {
  TransactionSenderAndConfirmationWaiterArgs,
  TransactionSenderAndConfirmationWaiterResponse,
} from './types';

import { TransactionExpiredBlockheightExceededError } from '@solana/web3.js';
import promiseRetry from 'promise-retry';

import { wait } from './helpers';

const SEND_OPTIONS = {
  skipPreflight: true,
};
const TIME_OUT = 2_000;

// https://github.com/jup-ag/jupiter-quote-api-node/blob/main/example/utils/transactionSender.ts
export async function transactionSenderAndConfirmationWaiter({
  connection,
  serializedTransaction,
  blockhashWithExpiryBlockHeight,
}: TransactionSenderAndConfirmationWaiterArgs): Promise<TransactionSenderAndConfirmationWaiterResponse> {
  const txId = await connection.sendRawTransaction(
    serializedTransaction,
    SEND_OPTIONS
  );

  const controller = new AbortController();
  const abortSignal = controller.signal;

  const abortableResender = async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await wait(TIME_OUT);
      if (abortSignal.aborted) {
        return;
      }
      try {
        await connection.sendRawTransaction(
          serializedTransaction,
          SEND_OPTIONS
        );
      } catch (e) {
        console.warn(`Failed to resend transaction: ${e}`);
      }
    }
  };

  try {
    const BLOCK_HEIGHT_DIFF = 150;
    void abortableResender();
    const lastValidBlockHeight =
      blockhashWithExpiryBlockHeight.lastValidBlockHeight - BLOCK_HEIGHT_DIFF;

    // this would throw TransactionExpiredBlockheightExceededError
    await Promise.race([
      connection.confirmTransaction(
        {
          ...blockhashWithExpiryBlockHeight,
          lastValidBlockHeight,
          signature: txId,
          abortSignal,
        },
        'confirmed'
      ),
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (resolve) => {
        // in case ws socket died
        while (!abortSignal.aborted) {
          await wait(TIME_OUT);
          const tx = await connection.getSignatureStatus(txId, {
            searchTransactionHistory: false,
          });
          if (tx?.value?.confirmationStatus === 'confirmed') {
            resolve(tx);
          }
        }
      }),
    ]);
  } catch (e) {
    if (e instanceof TransactionExpiredBlockheightExceededError) {
      // we consume this error and getTransaction would return null
      return { txId, txResponse: null };
    }
    // invalid state from web3.js
    throw e;
  } finally {
    controller.abort();
  }

  // in case rpc is not synced yet, we add some retries
  const txResponse = await promiseRetry(
    async (retry: any) => {
      const response = await connection.getTransaction(txId, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
      });
      if (!response) {
        retry(response);
      }
      return response;
    },
    {
      retries: 5,
      minTimeout: 1e3,
    }
  );

  return { txId, txResponse };
}
