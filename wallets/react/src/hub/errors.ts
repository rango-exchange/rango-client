import type { WalletConnectOrigin } from '../events.js';
import type { WalletType } from '@hub3js/core';
import type { Namespace } from '@hub3js/namespaces';

import { getErrorMessage, Hub3Error } from '@hub3js/core';
import { error as logError } from '@rango-dev/logging-core';

const NON_ERROR_THROWN_NAME = 'NonErrorThrown';
const NON_ERROR_THROWN_MESSAGE = 'Non-Error value thrown during connect.';

function wrapNonError(value: unknown): Error {
  const message =
    typeof value === 'string'
      ? value
      : getErrorMessage(value) ?? NON_ERROR_THROWN_MESSAGE;
  const wrapper = new Error(message, { cause: value });
  wrapper.name = NON_ERROR_THROWN_NAME;
  return wrapper;
}

/*
 * An allow list: among `Hub3Error`s only `PROVIDER_UNEXPECTED` is logged, so a type added later
 * (something the user can act on, like a rejection or a locked wallet) stays out of the logs.
 */
export function reportConnectionFailure(
  error: unknown,
  options: {
    walletType: WalletType;
    namespace: Namespace;
    origin: WalletConnectOrigin;
  }
): void {
  if (error instanceof Hub3Error) {
    if (error.type !== 'PROVIDER_UNEXPECTED') {
      return;
    }
    logError(error, {
      tags: { name: error.name, type: error.type, ...options },
    });
    return;
  }

  const reported = error instanceof Error ? error : wrapNonError(error);
  logError(reported, { tags: { name: reported.name, ...options } });
}
