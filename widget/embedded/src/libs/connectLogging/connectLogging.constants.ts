/** How long a wallet may leave an attempt unanswered before it's logged. */
export const CONNECT_TIMEOUT = 180_000;

export const CONNECT_TIMEOUT_MESSAGE =
  'Wallet connection still pending after 3 minutes';

export const UNREADABLE_FAILURE_MESSAGE = 'Failure could not be described';

/** No class is named like this, so it can't be mistaken for a real name. */
export const UNREADABLE_FAILURE_NAME = '(unreadable)';

export const ATTEMPT_ERROR_NAMES: readonly string[] = [
  'WalletConnectionAttemptError',
  'AutoConnectionAttemptError',
];

export const CONNECTION_ERROR_NAME = 'WalletConnectionError';
