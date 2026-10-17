export { default as Provider } from './provider.js';
export { useWallets } from './hooks.js';
export type * from './types.js';
export { WalletEventChannel, WalletEventTypes } from './events.js';
export type {
  Emitter,
  WalletConnectedEventPayload,
  WalletConnectFailedEventPayload,
  WalletConnectInitiatedEventPayload,
  WalletConnectOrigin,
  WalletDetectedEventPayload,
  WalletDisconnectedEventPayload,
  WalletEventData,
  WalletEvents,
} from './events.js';
export * from './legacy/types.js';
