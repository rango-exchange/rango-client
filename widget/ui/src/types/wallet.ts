export enum WalletState {
  NOT_INSTALLED = 'not installed',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
}
export declare enum WalletType {
  META_MASK = 'metamask',
  WALLET_CONNECT = 'wallet-connect',
  TRUST_WALLET = 'trust-wallet',
  TERRA_STATION = 'terra-station',
  KEPLR = 'keplr',
  OKX = 'okx',
  PHANTOM = 'phantom',
  COINBASE = 'coinbase',
  XDEFI = 'xdefi',
  BINANCE_CHAIN = 'binance-chain',
  LEAP = 'leap',
  CLOVER = 'clover',
  COSMOSTATION = 'cosmostation',
  COIN98 = 'coin98',
  SAFEPAL = 'safepal',
  TOKEN_POCKET = 'token-pocket',
  BRAVE = 'brave',
  UNKNOWN = 'unknown',
  MATH = 'math',
  EXODUS = 'exodus',
  ARGENTX = 'argentx',
  TRON_LINK = 'tron-link',
}

export type WalletInfo = {
  state:
    | WalletState.CONNECTED
    | WalletState.DISCONNECTED
    | WalletState.CONNECTING
    | WalletState.NOT_INSTALLED;
  installLink: string;
  name: string;
  image: string;
  type: WalletType;
};
