import { USER_REJECTION_ERROR_CODE } from '@hub3js/std/utils';

// Wallet-side rejection codes from `@walletconnect/utils`.
const USER_REJECTED_CODE = 5000;
const USER_REJECTED_METHODS_CODE = 5002;

/**
 * Gives WalletConnect's wallet-side rejections the standard rejection code. A
 * wallet-side `4001` already carries it, so it passes through unchanged.
 */
export function convertWalletConnectRejectionError(
  _context: unknown,
  error: unknown
): unknown {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error.code === USER_REJECTED_CODE ||
      error.code === USER_REJECTED_METHODS_CODE)
  ) {
    const message =
      'message' in error && error.message !== undefined
        ? String(error.message)
        : undefined;
    return Object.assign(new Error(message), {
      code: USER_REJECTION_ERROR_CODE,
    });
  }
  return error;
}
