import type { Transaction, VersionedTransaction } from '@solana/web3.js';

import { SignerError, SignerErrorCode } from 'rango-types';

import { getSolanaConnection } from './helpers';

const INSUFFICIENT_FUNDS_ERROR_CODE = 1;
const SLIPPAGE_ERROR_CODE = 6001;
const PROGRAM_FAILED_TO_COMPLETE_ERROR = 'ProgramFailedToComplete';
const ACCOUNT_NOT_FOUND_ERROR = 'AccountNotFound';

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

      throw getSimulationError(err, logs);
    }
  }
}

function getInsufficientFundsErrorMessage(logs: string[] | null) {
  const insufficientLamportErrorMessage = logs?.find((log) =>
    log.toLowerCase()?.includes('insufficient lamports')
  );
  return insufficientLamportErrorMessage || 'Insufficient funds';
}

function getSimulationError(
  error: string | { [key: string]: any },
  logs: string[] | null
) {
  let message =
    (logs?.length || 0) > 0 ? logs?.[logs?.length - 1] : JSON.stringify(error);

  /*
   * trying to detect common errors (e.g. insufficient fund or slippage error)
   * We could probably remove this code after upgrading solana/web3 lib to v2
   */
  if (typeof error === 'string') {
    message =
      error === ACCOUNT_NOT_FOUND_ERROR
        ? 'Attempt to debit an account but found no record of a prior credit.'
        : error;
  } else {
    if (
      Array.isArray(error?.InstructionError) &&
      error.InstructionError.length > 1
    ) {
      const instructionError = error.InstructionError[1];

      if (typeof instructionError === 'object') {
        switch (instructionError.Custom) {
          case INSUFFICIENT_FUNDS_ERROR_CODE:
            message = getInsufficientFundsErrorMessage(logs);
            break;
          case SLIPPAGE_ERROR_CODE:
            message = 'Slippage error';
            break;
          default:
            break;
        }
      } else if (instructionError === PROGRAM_FAILED_TO_COMPLETE_ERROR) {
        message = 'Program failed to complete';
      }
    } else if (error?.InsufficientFundsForRent) {
      message =
        'Transaction results in an account with insufficient funds for rent.';
    }
  }

  return new SignerError(
    SignerErrorCode.SEND_TX_ERROR,
    undefined,
    `Simulation failed: ${message}`
  );
}
