import { ConnectionErrorType, isUserRejectionError } from '@hub3js/std/utils';
import { getNoirWallet } from '@noir-wallet/sdk';

const NOIR_REJECTION_MESSAGE = 'User rejected the request';

export function classifyNoirConnectionError(
  error: unknown
): ConnectionErrorType {
  if (error instanceof Error && error.message === NOIR_REJECTION_MESSAGE) {
    return ConnectionErrorType.Rejected;
  }
  return isUserRejectionError(error)
    ? ConnectionErrorType.Rejected
    : ConnectionErrorType.Unknown;
}

export const getInstanceOrThrow = () => {
  const noirWallet = getNoirWallet();
  if (!noirWallet) {
    throw new Error('Noir Wallet not installed');
  }
  return noirWallet;
};
