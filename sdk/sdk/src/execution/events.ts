/**
 * What a host tells the engine about a wallet, from the wallet layer's own
 * lifecycle: it connected, it disconnected, or it changed account or network
 * while connected. The engine treats them all the same way, by running every
 * execution parked on that wallet again, since the guard in front of signing
 * reads the wallet's live state rather than the event. The kinds are kept
 * apart so a host reports what it saw and a later engine can tell them apart.
 */
export type WalletEventType =
  | 'wallet_connected'
  | 'wallet_disconnected'
  | 'wallet_accounts_changed'
  | 'wallet_network_changed';

export type WalletEvent = {
  type: WalletEventType;
  /** The wallet type as the host's wallet layer names it, e.g. `metamask`. */
  walletType: string;
};
