import type { WalletConnectionTagSource } from '@hub3js/std/utils';

import { ConnectionErrorType } from '@hub3js/std/utils';
import { getRangoError } from 'rango-types';

import { logRangoError } from './errors';

export type ConnectionReportOptions = {
  source: WalletConnectionTagSource;
};

const NOT_REPORTED_TYPES: readonly string[] = [
  ConnectionErrorType.Rejected,
  ConnectionErrorType.Locked,
];

/**
 * Logs a connection failure unless the user caused it. Never rethrows: a
 * failure inside reporting is swallowed, so reporting can't change what the
 * caller sees, and a caller may call this synchronously inside its own catch
 * block before doing anything else.
 */
export function reportConnectionError(
  error: unknown,
  context: ConnectionReportOptions
): void {
  try {
    const rangoError = getRangoError(error).addTag('source', context.source);

    if (!NOT_REPORTED_TYPES.includes(rangoError.type)) {
      logRangoError(rangoError);
    }
  } catch {
    // Reporting must never change what the caller sees.
  }
}
