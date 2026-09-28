import type { Context } from '@hub3js/core';

import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  getErrorMessage,
  WalletConnectionError,
} from '@hub3js/std/utils';

// Trust Wallet's in-app browser rejects with a bare string, not an EIP-1193 error.
const IN_APP_BROWSER_REJECTION = 'cancelled';

// The connect chain's last or-hook, so it throws: an error it returned would become connect's result.
function reclassifyTrustWalletConnectionError(
  _context: Context,
  error: unknown
): never {
  if (
    error instanceof WalletConnectionError &&
    error.type === ConnectionErrorType.Unknown &&
    error.cause === IN_APP_BROWSER_REJECTION
  ) {
    throw new WalletConnectionError(
      getErrorMessage(error.cause) ??
        CONNECTION_ERROR_MESSAGES[ConnectionErrorType.Rejected],
      { type: ConnectionErrorType.Rejected, cause: error.cause }
    );
  }
  throw error;
}

export const commonHooks = { reclassifyTrustWalletConnectionError };
