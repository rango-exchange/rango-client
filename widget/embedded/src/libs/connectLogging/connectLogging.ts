import type {
  ConnectFailureCategory,
  ConnectionAttempt,
  ConnectionFailureDetails,
  ConnectLogContext,
  ConnectLogEvent,
  ConnectLogTags,
  FailureCategory,
  LoggedConnectionAttempt,
} from './connectLogging.types';
import type { WalletType } from '@hub3js/core';
import type { WalletErrorCode } from '@hub3js/std/utils';
import type {
  ConnectResult,
  NamespaceInputForConnect,
} from '@rango-dev/wallets-react';

import {
  USER_REJECTION_ERROR_CODE,
  WALLET_LOCKED_ERROR_CODE,
} from '@hub3js/std/utils';
import { error as logError } from '@rango-dev/logging-core';
import {
  AutoConnectionAttemptError,
  WalletConnectionAttemptError,
} from '@rango-dev/wallets-react';

import {
  ATTEMPT_ERROR_NAMES,
  CONNECT_TIMEOUT,
  CONNECT_TIMEOUT_MESSAGE,
  CONNECTION_ERROR_NAME,
  UNREADABLE_FAILURE_MESSAGE,
  UNREADABLE_FAILURE_NAME,
} from './connectLogging.constants';

/** An attempt, as read from what it failed with. */
type FailedAttempt = Omit<LoggedConnectionAttempt, 'requestedNamespaces'> & {
  errors: unknown[];
  /** Read from the failure, so any value at all. */
  requestedNamespaces: unknown[];
};

/**
 * Failures come from wallet bundles the widget doesn't control, so any read can
 * throw. Each field is read on its own, so one nobody can read costs only itself.
 */
function readOrStandIn<Value>(read: () => Value, standIn: Value): Value {
  try {
    return read();
  } catch {
    return standIn;
  }
}

/** A field of any value at all, or `standIn` when reading it throws. */
function readField(value: unknown, field: string, standIn?: unknown): unknown {
  return readOrStandIn(
    () =>
      typeof value === 'object' && value !== null
        ? (value as Record<string, unknown>)[field]
        : undefined,
    standIn
  );
}

/** The field when it's a string, `standIn` when it can't be read as one. */
function readString(value: unknown, field: string): string | undefined;
function readString(value: unknown, field: string, standIn: string): string;
function readString(
  value: unknown,
  field: string,
  standIn?: string
): string | undefined {
  const found = readField(value, field, standIn);

  return typeof found === 'string' ? found : standIn;
}

function readCode(value: unknown): WalletErrorCode | undefined {
  const code = readField(value, 'code');

  return typeof code === 'number' || typeof code === 'string'
    ? code
    : undefined;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// By name, not `instanceof`: a host may bundle more than one copy of the packages.
function isConnectionError(failure: unknown): boolean {
  return readString(failure, 'name') === CONNECTION_ERROR_NAME;
}

/**
 * Anything other than an attempt error is read as an attempt with that value as
 * its only failure, requesting what the caller asked for.
 */
function readAttempt(
  thrown: unknown,
  attempt: LoggedConnectionAttempt
): FailedAttempt {
  const errors = ATTEMPT_ERROR_NAMES.includes(readString(thrown, 'name') ?? '')
    ? readField(thrown, 'errors')
    : undefined;
  if (!Array.isArray(errors)) {
    return { ...attempt, errors: [thrown] };
  }

  const requested = readField(thrown, 'requestedNamespaces');

  return {
    ...attempt,
    errors,
    requestedNamespaces: Array.isArray(requested)
      ? requested
      : attempt.requestedNamespaces,
  };
}

function classifyFailure(failure: unknown): FailureCategory {
  if (!isConnectionError(failure)) {
    return 'unknown';
  }

  // A failure nobody can check against the ignored kinds is worth seeing.
  const code = readCode(failure);
  if (code === USER_REJECTION_ERROR_CODE) {
    return 'rejected';
  }
  if (code === WALLET_LOCKED_ERROR_CODE) {
    return 'locked';
  }

  return 'wallet';
}

/**
 * The category of an attempt's event, or `null` when it has no logged failures.
 */
function resolveCategory(
  categories: FailureCategory[]
): Exclude<ConnectFailureCategory, 'timeout'> | null {
  if (categories.includes('unknown')) {
    return 'unknown';
  }
  if (categories.includes('wallet')) {
    return 'wallet';
  }

  return null;
}

/** Sorted, deduplicated and comma-joined. An empty string counts as none. */
function joinSorted(values: (string | undefined)[]): string | undefined {
  const present = new Set(values.filter((value): value is string => !!value));

  return present.size ? [...present].sort().join(',') : undefined;
}

function buildTags(params: {
  attempt: FailedAttempt;
  category: ConnectFailureCategory;
  /** Absent when no namespace can be blamed: the requested ones are tagged. */
  blamedFailures?: unknown[];
}): ConnectLogTags {
  const { attempt, category, blamedFailures } = params;
  const requested = attempt.requestedNamespaces.map((request) => ({
    namespace: readString(request, 'namespace'),
    network: readString(request, 'network'),
  }));
  const namespaces = blamedFailures
    ? blamedFailures.map((failure) => readString(failure, 'namespace'))
    : requested.map(({ namespace }) => namespace);
  const networks = requested
    .filter(({ namespace }) => !!namespace && namespaces.includes(namespace))
    .map(({ network }) => network);

  const namespacesTag = joinSorted(namespaces);
  const networkTag = joinSorted(networks);

  return {
    walletType: attempt.walletType,
    ...(namespacesTag ? { namespaces: namespacesTag } : {}),
    ...(networkTag ? { network: networkTag } : {}),
    trigger: attempt.trigger,
    category,
  };
}

function describeFailure(failure: unknown): ConnectionFailureDetails {
  const namespace = isConnectionError(failure)
    ? readString(failure, 'namespace')
    : undefined;
  const code = readCode(failure);

  return {
    ...(namespace !== undefined ? { namespace } : {}),
    name: readString(failure, 'name', UNREADABLE_FAILURE_NAME),
    message: readString(failure, 'message', UNREADABLE_FAILURE_MESSAGE),
    ...(code !== undefined ? { code } : {}),
  };
}

function buildContext(attempt: FailedAttempt): ConnectLogContext {
  return {
    failures: attempt.errors.map(describeFailure),
    requestedNamespaces: attempt.requestedNamespaces
      .map((request) => readString(request, 'namespace'))
      .filter(isString),
  };
}

/**
 * What the attempt failed with, unchanged. `connect` and auto-connect only ever
 * fail with errors, but logging-core takes nothing else, so any other value is
 * logged as the one-failure attempt it's read as.
 */
function toLoggedError(
  thrown: unknown,
  attempt: LoggedConnectionAttempt
): Error {
  if (thrown instanceof Error) {
    return thrown;
  }

  const AttemptError =
    attempt.trigger === 'auto-connect'
      ? AutoConnectionAttemptError
      : WalletConnectionAttemptError;

  return new AttemptError({
    errors: [thrown],
    requestedNamespaces: attempt.requestedNamespaces,
  });
}

/**
 * Builds the event for an attempt that failed with `thrown`, or `null` when
 * every failure is a rejection or a locked wallet.
 */
function buildConnectFailureEvent(
  thrown: unknown,
  attempt: LoggedConnectionAttempt
): ConnectLogEvent | null {
  const failedAttempt = readAttempt(thrown, attempt);
  const categories = failedAttempt.errors.map(classifyFailure);
  const category = resolveCategory(categories);
  if (!category) {
    return null;
  }

  return {
    error: toLoggedError(thrown, attempt),
    tags: buildTags({
      attempt: failedAttempt,
      category,
      blamedFailures:
        category === 'wallet'
          ? failedAttempt.errors.filter(
              (_, index) => categories[index] === 'wallet'
            )
          : undefined,
    }),
    context: buildContext(failedAttempt),
  };
}

function buildTimeoutError(
  requestedNamespaces: NamespaceInputForConnect[]
): WalletConnectionAttemptError {
  return new WalletConnectionAttemptError({
    errors: [],
    requestedNamespaces: requestedNamespaces.map(({ namespace, network }) => ({
      namespace,
      network,
    })),
    message: CONNECT_TIMEOUT_MESSAGE,
  });
}

function buildConnectTimeoutEvent(attempt: ConnectionAttempt): ConnectLogEvent {
  const error = buildTimeoutError(attempt.requestedNamespaces);
  const timedOut: FailedAttempt = {
    ...attempt,
    errors: [],
    requestedNamespaces: error.requestedNamespaces,
  };

  return {
    error,
    tags: buildTags({ attempt: timedOut, category: 'timeout' }),
    context: buildContext(timedOut),
  };
}

// Logging must never change what the caller sees, so an event that can't be built or sent is dropped.
function dropIfItThrows(send: () => void): void {
  try {
    send();
  } catch {
    // Dropped on purpose.
  }
}

/** Logs an attempt that failed with `thrown`, unless it's ignored. Never throws. */
function logConnectFailure(
  thrown: unknown,
  attempt: LoggedConnectionAttempt
): void {
  dropIfItThrows(() => {
    const event = buildConnectFailureEvent(thrown, attempt);
    if (event) {
      logError(event.error, { tags: event.tags, context: event.context });
    }
  });
}

/** Logs the error of an `AUTO_CONNECT_FAILED` event. Never throws. */
export function logAutoConnectFailure(
  walletType: WalletType,
  thrown: unknown
): void {
  logConnectFailure(thrown, {
    walletType,
    trigger: 'auto-connect',
    requestedNamespaces: [],
  });
}

/**
 * Runs an attempt, logs whatever it fails with, and logs a timeout if it's
 * still pending after 3 minutes. The timer follows the attempt, not a
 * component, and never cancels it. What `connect` throws is rethrown unchanged.
 */
export async function runConnectWithLogging(
  attempt: ConnectionAttempt,
  connect: () => Promise<ConnectResult[]>
): Promise<ConnectResult[]> {
  const timeoutId = setTimeout(
    () =>
      dropIfItThrows(() => {
        const { error, tags, context } = buildConnectTimeoutEvent(attempt);
        logError(error, { tags, context });
      }),
    CONNECT_TIMEOUT
  );

  try {
    return await connect();
  } catch (thrown) {
    logConnectFailure(thrown, attempt);
    throw thrown;
  } finally {
    clearTimeout(timeoutId);
  }
}
