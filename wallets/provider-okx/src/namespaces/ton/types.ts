export type Environments = {
  tonConnectManifestUrl?: string;
};

/*
 * OKX injects a standard TonConnect JS bridge at `window.okxTonWallet.tonconnect`.
 * The types below describe the subset of the TonConnect protocol we rely on,
 * plus OKX's non-standard `on`/`off` event API.
 */
export type TonAddressItemReply = {
  name: 'ton_addr';
  // Raw format: `<workchain>:<hex>`
  address: string;
  // '-239' for mainnet, '-3' for testnet
  network: string;
  walletStateInit: string;
  publicKey: string;
};

export type TonConnectEventSuccess = {
  event: 'connect';
  id: number;
  payload: {
    items: Array<TonAddressItemReply | { name: string }>;
    device: unknown;
  };
};

export type TonConnectEventError = {
  event: 'connect_error';
  id: number;
  payload: {
    code: number;
    message: string;
  };
};

export type TonConnectEvent = TonConnectEventSuccess | TonConnectEventError;

export type TonConnectRequest = {
  manifestUrl: string;
  items: Array<{ name: 'ton_addr' }>;
};

export type TonConnectAppRequest = {
  method: 'sendTransaction' | 'disconnect';
  params: string[];
  id: string;
};

export type TonConnectWalletResponseSuccess = {
  result: string;
  id: string;
};

export type TonConnectWalletResponseError = {
  error: { code: number; message: string; data?: unknown };
  id: string;
};

export type TonConnectWalletResponse =
  | TonConnectWalletResponseSuccess
  | TonConnectWalletResponseError;

export interface TonProviderApi {
  deviceInfo: unknown;
  walletInfo?: unknown;
  protocolVersion: number;
  connect(
    protocolVersion: number,
    message: TonConnectRequest
  ): Promise<TonConnectEvent>;
  restoreConnection(): Promise<TonConnectEvent>;
  send(message: TonConnectAppRequest): Promise<TonConnectWalletResponse>;
  listen(callback: (event: unknown) => void): () => void;
  /*
   * Non-standard OKX-specific event API. `accountChanged` fires when the user
   * switches the active account inside the wallet; its payload is undocumented
   * and must not be relied on.
   */
  on(
    event: 'accountChanged' | 'connect' | 'disconnect',
    callback: (payload?: unknown) => void
  ): void;
  off(
    event: 'accountChanged' | 'connect' | 'disconnect',
    callback: (payload?: unknown) => void
  ): void;
}
