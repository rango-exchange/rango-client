import type { Context } from '@hub3js/core';

import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  getErrorMessage,
  WalletConnectionError,
} from '@hub3js/std/utils';

// Enkrypt rejects with a bare string, not an error object.
const ENKRYPT_REJECTION =
  'User Rejected Request: The user rejected the request.';

// The connect chain's last or-hook, so it throws: an error it returned would become connect's result.
function reclassifyEnkryptConnectionError(
  _context: Context,
  error: unknown
): never {
  if (
    error instanceof WalletConnectionError &&
    error.type === ConnectionErrorType.Unknown &&
    error.cause === ENKRYPT_REJECTION
  ) {
    throw new WalletConnectionError(
      getErrorMessage(error.cause) ??
        CONNECTION_ERROR_MESSAGES[ConnectionErrorType.Rejected],
      { type: ConnectionErrorType.Rejected, cause: error.cause }
    );
  }
  throw error;
}

export const evmHooks = { reclassifyEnkryptConnectionError };
