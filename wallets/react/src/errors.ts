import type { NamespaceInputForConnect } from './legacy/types.js';
import type { Option, Result } from 'ts-results';

import { WalletConnectionError } from '@hub3js/std/utils';

export type WalletConnectionAttemptErrorOptions = {
  errors: unknown[];
  requestedNamespaces: NamespaceInputForConnect[];
  message?: string;
};

function messageOf(value: unknown): string {
  if (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  ) {
    return value.message;
  }
  return String(value);
}

/**
 * A connection attempt that failed.
 *
 * - `errors` holds every failed namespace's `WalletConnectionError`, in request order,
 *   followed by any other value thrown during the attempt.
 * - `requestedNamespaces` lists every namespace the attempt requested, in request
 *   order, cancelled ones included, with the network and derivation path passed for it.
 * - `message` is the `message` passed in, or else the first entry's.
 *
 * It has no `code` and no `cause`: read them from each entry.
 */
export class WalletConnectionAttemptError extends AggregateError {
  name = 'WalletConnectionAttemptError';
  declare errors: unknown[];
  readonly requestedNamespaces: NamespaceInputForConnect[];

  constructor(options: WalletConnectionAttemptErrorOptions) {
    const { errors, requestedNamespaces, message } = options;
    super(errors, message ?? (errors.length > 0 ? messageOf(errors[0]) : ''));
    this.requestedNamespaces = requestedNamespaces;
  }
}

/**
 * An auto-connect attempt that failed. Auto-connect sends it with
 * `Events.AUTO_CONNECT_FAILED`.
 */
export class AutoConnectionAttemptError extends WalletConnectionAttemptError {
  name = 'AutoConnectionAttemptError';
}

export type NamespaceConnectAttempt<T = unknown> = {
  input: NamespaceInputForConnect;
  result: Result<T, unknown>;
  // The connect queue abandoned the namespace after another one was rejected.
  cancelled?: boolean;
};

/**
 * Lists each failed namespace's `WalletConnectionError` in request order, leaving
 * cancelled namespaces out. A failure that isn't one yet (e.g. from an integrator's
 * provider, or a before-hook) is wrapped in one for its namespace.
 */
export function collectConnectionFailures(
  attempts: NamespaceConnectAttempt[]
): WalletConnectionError[] {
  return attempts.flatMap(({ input, result, cancelled }) => {
    if (cancelled || result.ok) {
      return [];
    }
    return result.val instanceof WalletConnectionError
      ? [result.val]
      : [
          new WalletConnectionError({
            namespace: input.namespace,
            cause: result.val,
          }),
        ];
  });
}

/**
 * Builds the error `connect` throws, or returns `undefined` when every namespace
 * connected and nothing else was thrown. `nonNamespaceError` holds the value thrown
 * outside any namespace, if any, such as a config error; it's added after the
 * namespace failures, unchanged.
 */
export function buildConnectionAttemptError(params: {
  requestedNamespaces: NamespaceInputForConnect[];
  attempts: NamespaceConnectAttempt[];
  nonNamespaceError: Option<unknown>;
}): WalletConnectionAttemptError | undefined {
  const { requestedNamespaces, attempts, nonNamespaceError } = params;
  if (attempts.every(({ result }) => result.ok) && nonNamespaceError.none) {
    return undefined;
  }

  const errors: unknown[] = collectConnectionFailures(attempts);
  if (nonNamespaceError.some) {
    errors.push(nonNamespaceError.val);
  }
  return new WalletConnectionAttemptError({ errors, requestedNamespaces });
}

/**
 * Builds the value of `Events.AUTO_CONNECT_FAILED` from the namespaces auto-connect
 * tried to connect for a wallet. Returns `undefined` when none of them failed.
 */
export function buildAutoConnectionAttemptError(
  attempts: NamespaceConnectAttempt[]
): AutoConnectionAttemptError | undefined {
  const errors = collectConnectionFailures(attempts);
  if (!errors.length) {
    return undefined;
  }

  return new AutoConnectionAttemptError({
    errors,
    requestedNamespaces: attempts.map(({ input }) => input),
  });
}
