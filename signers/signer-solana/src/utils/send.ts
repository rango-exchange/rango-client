import type {
  TransactionSenderAndConfirmationWaiterArgs,
  TransactionSenderAndConfirmationWaiterResponse,
} from './types.js';

import { TransactionExpiredBlockheightExceededError } from '@solana/web3.js';
import promiseRetry from 'promise-retry';
import { SignerError, SignerErrorCode } from 'rango-types';

import { wait } from './helpers.js';

const SEND_OPTIONS = {
  skipPreflight: true,
};
const TIME_OUT = 2_000;
const CONFIRMATION_TIME_OUT = 60_000;

// https://github.com/jup-ag/jupiter-quote-api-node/blob/main/example/utils/transactionSender.ts
export async function transactionSenderAndConfirmationWaiter({
  connection,
  serializedTransaction,
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
    void abortableResender();

    // this would throw TransactionExpiredBlockheightExceededError
    await Promise.race([
      new Promise((_, reject) =>
        setTimeout(() => {
          if (!abortSignal.aborted) {
            reject(
              new SignerError(
                SignerErrorCode.SEND_TX_ERROR,
                undefined,
                `Error confirming transaction (timeout)`
              )
            );
          }
        }, CONFIRMATION_TIME_OUT)
      ),
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (resolve, reject) => {
        // in case ws socket died
        while (!abortSignal.aborted) {
          await wait(TIME_OUT);
          const { value: statuses } = await connection.getSignatureStatuses(
            [txId],
            {
              searchTransactionHistory: false,
            }
          );
          if (statuses?.length > 0) {
            const status = statuses[0];
            if (status) {
              if (status.err) {
                reject(
                  new SignerError(
                    SignerErrorCode.SEND_TX_ERROR,
                    undefined,
                    `Transaction failed: ${JSON.stringify(status.err)}`
                  )
                );
              }
              if (
                status.confirmationStatus &&
                ['confirmed', 'finalized'].includes(status.confirmationStatus)
              ) {
                resolve(true);
              }
            }
          }
        }
      }),
    ]);
  } catch (e) {
    if (e instanceof TransactionExpiredBlockheightExceededError) {
      // we consume this error and getTransaction would return null
      return { txId, txResponse: null };
    }
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
