import type { WalletType } from '@hub3js/core';
import type { WalletErrorCode } from '@hub3js/std/utils';
import type { NamespaceInputForConnect } from '@rango-dev/wallets-react';

/** Where in the widget the user started a connection attempt from. */
export type ConnectTrigger =
  | 'wallets-page'
  | 'confirm-wallets-modal'
  | 'swap-details-reconnect'
  | 'swap-details-switch-network'
  | 'queue-switch-network';

/**
 * The trigger a logged attempt is tagged with. `auto-connect` is kept out of
 * `ConnectTrigger`, so nothing can start a timed attempt as auto-connect.
 */
export type ConnectLogTrigger = ConnectTrigger | 'auto-connect';

/** The trigger as a prop, declared once for every layer it travels through. */
export type WithConnectTrigger = { trigger?: ConnectTrigger };

/**
 * What one connection failure of an attempt is. Rejected and locked failures
 * are set aside; the others are the attempt's logged failures: `wallet` is a
 * wallet connection error worth logging, `unknown` is anything else.
 */
export type FailureCategory = 'rejected' | 'locked' | 'wallet' | 'unknown';

export type ConnectFailureCategory = 'wallet' | 'unknown' | 'timeout';

/** What the caller knows about an attempt before it settles. */
export type ConnectionAttempt<Trigger = ConnectTrigger> = {
  walletType: WalletType;
  trigger: Trigger;
  /** In request order. */
  requestedNamespaces: NamespaceInputForConnect[];
};

export type LoggedConnectionAttempt = ConnectionAttempt<ConnectLogTrigger>;

/**
 * One connection failure of an attempt, without anything that identifies the
 * user.
 */
export type ConnectionFailureDetails = {
  namespace?: string;
  name?: string;
  message: string;
  code?: WalletErrorCode;
};

export type ConnectLogTags = {
  walletType: WalletType;
  namespaces?: string;
  network?: string;
  trigger: ConnectLogTrigger;
  category: ConnectFailureCategory;
};

export type ConnectLogContext = {
  failures: ConnectionFailureDetails[];
  requestedNamespaces: string[];
};

/** What is logged for one failed connection attempt. */
export type ConnectLogEvent = {
  error: Error;
  tags: ConnectLogTags;
  context: ConnectLogContext;
};
