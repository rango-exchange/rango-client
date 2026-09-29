import type { WalletType } from '@hub3js/core';
import type { Namespace } from '@hub3js/namespaces';
import type { BlockchainMeta } from 'rango-types';

import { getBlockChainNameFromId } from '@rango-dev/internal-blockchains';

import { WALLET_DETECTED_SKIPPED_IDS } from './hub/constants.js';

export const WalletEventChannel = 'walletEvent';

export enum WalletEventTypes {
  WALLET_DETECTED = 'walletDetected',
  WALLET_CONNECT_INITIATED = 'walletConnectInitiated',
  WALLET_CONNECTED = 'walletConnected',
  WALLET_CONNECT_FAILED = 'walletConnectFailed',
  WALLET_DISCONNECTED = 'walletDisconnected',
}

export type WalletConnectOrigin = 'manual' | 'auto';

type WalletConnectEventPayload = {
  /** Wallet type id, e.g. `metamask`. */
  walletName: WalletType;
  namespace: Namespace;
  /** Rango blockchain name (e.g. `ETH`), or `null` when it isn't known. */
  chain: string | null;
  origin: WalletConnectOrigin;
};

export type WalletDetectedEventPayload = {
  walletName: WalletType;
};
export type WalletConnectInitiatedEventPayload = WalletConnectEventPayload;
export type WalletConnectedEventPayload = WalletConnectEventPayload;
export type WalletConnectFailedEventPayload = WalletConnectEventPayload;
export type WalletDisconnectedEventPayload = {
  walletName: WalletType;
  namespace: Namespace;
};

type EventData<T extends WalletEventTypes, U> = { type: T; payload: U };

export type WalletEventData =
  | EventData<WalletEventTypes.WALLET_DETECTED, WalletDetectedEventPayload>
  | EventData<
      WalletEventTypes.WALLET_CONNECT_INITIATED,
      WalletConnectInitiatedEventPayload
    >
  | EventData<WalletEventTypes.WALLET_CONNECTED, WalletConnectedEventPayload>
  | EventData<
      WalletEventTypes.WALLET_CONNECT_FAILED,
      WalletConnectFailedEventPayload
    >
  | EventData<
      WalletEventTypes.WALLET_DISCONNECTED,
      WalletDisconnectedEventPayload
    >;

export type WalletEvents = {
  [WalletEventChannel]: WalletEventData;
};

export interface Emitter<Events extends Record<string, unknown>> {
  emit<K extends keyof Events>(type: K, event: Events[K]): void;
}

export type WalletEventEmitter = Emitter<WalletEvents>;

const detectedWallets = new Set<WalletType>();

export function emitWalletDetectedOnce(
  emitter: WalletEventEmitter,
  walletName: WalletType
): void {
  if (
    detectedWallets.has(walletName) ||
    WALLET_DETECTED_SKIPPED_IDS.includes(walletName)
  ) {
    return;
  }
  detectedWallets.add(walletName);
  emitter.emit(WalletEventChannel, {
    type: WalletEventTypes.WALLET_DETECTED,
    payload: { walletName },
  });
}

/**
 * Connect results may carry an EVM chain id (e.g. `0x1`); events always carry a Rango blockchain name.
 */
export function toBlockchainName(
  network: string | null | undefined,
  allBlockChains: BlockchainMeta[] | undefined
): string | null {
  if (!network) {
    return null;
  }
  return getBlockChainNameFromId(network, allBlockChains || []);
}
