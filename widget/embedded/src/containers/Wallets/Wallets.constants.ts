import { Events } from '@rango-dev/wallets-react';

/*
 * Events the widget keeps to itself, never passed on to `onUpdateState`.
 *
 * PROVIDER_DISCONNECTED has conflict with WalletEventTypes.DISCONNECT since they are doing samething, the first one is using only for Hub, the second one is what we exposed to the lib users.
 * so for backward-compat we need to keep the behavior of WalletEventTypes.DISCONNECT
 *
 * AUTO_CONNECT_FAILED only exists so the widget can log it.
 */
export const INTERNAL_EVENTS = [
  Events.PROVIDER_DISCONNECTED,
  Events.AUTO_CONNECT_FAILED,
] as const;
