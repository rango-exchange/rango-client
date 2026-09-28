import { ConnectionErrorType, isUserRejectionError } from '@hub3js/std/utils';
import * as freighterApi from '@stellar/freighter-api';

// The code of Freighter's `FreighterApiDeclinedError`.
const FREIGHTER_DECLINED_ERROR_CODE = -4;

export function classifyFreighterConnectionError(
  error: unknown
): ConnectionErrorType {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === FREIGHTER_DECLINED_ERROR_CODE
  ) {
    return ConnectionErrorType.Rejected;
  }
  return isUserRejectionError(error)
    ? ConnectionErrorType.Rejected
    : ConnectionErrorType.Unknown;
}

export async function checkInstallation(): Promise<boolean> {
  const result = await freighterApi.isConnected();

  return result.isConnected;
}
