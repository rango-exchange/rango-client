import type { WalletType } from '@hub3js/core';
import type { Namespace } from '@hub3js/namespaces';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';
import { error as logError } from '@rango-dev/logging-core';

const UNKNOWN_ERROR_NAME = 'UnknownError';
const UNKNOWN_ERROR_MESSAGE = 'Unknown error';

const DROPPED_CONNECTION_ERROR_TYPES: ConnectionErrorType[] = [
  ConnectionErrorType.Rejected,
  ConnectionErrorType.Locked,
];

interface WalletConnectionErrorOptions {
  walletType: WalletType;
  namespace?: Namespace;
}

interface ReportRangoErrorOptions {
  walletConnection?: WalletConnectionErrorOptions;
}

function messageOf(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string' &&
    value.message
  ) {
    return value.message;
  }

  return UNKNOWN_ERROR_MESSAGE;
}

function reportConnectionError(
  error: WalletConnectionError,
  options: WalletConnectionErrorOptions | undefined
): void {
  if (DROPPED_CONNECTION_ERROR_TYPES.includes(error.type)) {
    return;
  }

  logError(error, {
    tags: {
      name: error.name,
      type: error.type,
      ...(options?.walletType && { walletType: options.walletType }),
      ...(options?.namespace && { namespace: options.namespace }),
    },
  });
}

export function reportRangoError(
  error: unknown,
  options: ReportRangoErrorOptions = {}
): void {
  if (error instanceof WalletConnectionError) {
    reportConnectionError(error, options.walletConnection);
    return;
  }

  const loggable =
    error instanceof Error
      ? error
      : new Error(messageOf(error), { cause: error });

  logError(loggable, { tags: { name: UNKNOWN_ERROR_NAME } });
}
