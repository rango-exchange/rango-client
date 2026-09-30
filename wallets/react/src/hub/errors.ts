import type { WalletType } from '@hub3js/core';
import type { Namespace } from '@hub3js/namespaces';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';
import { error as logError } from '@rango-dev/logging-core';

type ConnectionOrigin = 'manual' | 'auto';

// The user caused these failures. It's a drop list, so a type added later is reported.
const UNREPORTED_CONNECTION_ERROR_TYPES: ConnectionErrorType[] = [
  ConnectionErrorType.Rejected,
  ConnectionErrorType.Locked,
];

export function reportConnectionFailure(
  error: unknown,
  options: {
    walletType: WalletType;
    namespace: Namespace;
    origin: ConnectionOrigin;
  }
): void {
  if (
    !(error instanceof WalletConnectionError) ||
    UNREPORTED_CONNECTION_ERROR_TYPES.includes(error.type)
  ) {
    return;
  }

  logError(error, {
    tags: {
      name: error.name,
      type: error.type,
      walletType: options.walletType,
      namespace: options.namespace,
      origin: options.origin,
    },
  });
}
