import type { Context } from '@hub3js/core';

import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  getErrorMessage,
  WalletConnectionError,
} from '@hub3js/std/utils';

const SLUSH_REJECTION_ERROR_NAME = 'TRPCClientError';
const SLUSH_REJECTION_MESSAGE = 'User rejected the request.';

function isSlushRejection(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.name === SLUSH_REJECTION_ERROR_NAME &&
    error.message === SLUSH_REJECTION_MESSAGE
  );
}

// The connect chain's last or-hook, so it throws: an error it returned would become connect's result.
function reclassifySlushConnectionError(
  _context: Context,
  error: unknown
): never {
  if (
    error instanceof WalletConnectionError &&
    error.type === ConnectionErrorType.Unknown &&
    isSlushRejection(error.cause)
  ) {
    throw new WalletConnectionError(
      getErrorMessage(error.cause) ??
        CONNECTION_ERROR_MESSAGES[ConnectionErrorType.Rejected],
      { type: ConnectionErrorType.Rejected, cause: error.cause }
    );
  }
  throw error;
}

export const suiHooks = { reclassifySlushConnectionError };
