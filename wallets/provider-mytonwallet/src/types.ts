//TODO : move instance types to wallets-shared

type SendTransactionFeatureDeprecated = 'SendTransaction';
type SendTransactionFeature = {
  name: 'SendTransaction';
  maxMessages: number;
};
type SignDataFeature = { name: 'SignData' };

type Feature =
  | SendTransactionFeatureDeprecated
  | SendTransactionFeature
  | SignDataFeature;

type WalletInfo = {
  name: string;
  image: string;
  tondns?: string;
  about_url: string;
};

interface DeviceInfo {
  platform:
    | 'iphone'
    | 'ipad'
    | 'android'
    | 'windows'
    | 'mac'
    | 'linux'
    | 'browser';
  appName: string; // e.g. "Tonkeeper"
  appVersion: string; // e.g. "2.3.367"
  maxProtocolVersion: number;
  features: Feature[];
}

type ConnectItem = TonAddressItem | TonProofItem;

interface TonAddressItem {
  name: 'ton_addr';
}

interface TonProofItem {
  name: 'ton_proof';
  payload: string;
}

interface ConnectRequest {
  manifestUrl: string;
  items: ConnectItem[];
}

type ConnectItemReply = TonAddressItemReply | TonProofItemReply;

enum CHAIN {
  MAINNET = '-239',
  TESTNET = '-3',
}

interface TonAddressItemReply {
  name: 'ton_addr';
  address: string;
  network: CHAIN;
  walletStateInit: string;
  publicKey: string;
}

type TonProofItemReply = TonProofItemReplySuccess | TonProofItemReplyError;

interface TonProofItemReplySuccess {
  name: 'ton_proof';
  proof: {
    timestamp: number;
    domain: {
      lengthBytes: number;
      value: string;
    };
    payload: string;
    signature: string;
  };
}

enum CONNECT_ITEM_ERROR_CODES {
  UNKNOWN_ERROR = 0,
  METHOD_NOT_SUPPORTED = 400,
}

type ConnectItemReplyError<T> = {
  name: T;
  error: {
    code: CONNECT_ITEM_ERROR_CODES;
    message?: string;
  };
};

type TonProofItemReplyError = ConnectItemReplyError<
  TonProofItemReplySuccess['name']
>;

interface ConnectEventSuccess {
  event: 'connect';
  id: number;
  payload: {
    items: ConnectItemReply[];
    device: DeviceInfo;
  };
}

interface ConnectEventError {
  event: 'connect_error';
  id: number;
  payload: {
    code: CONNECT_EVENT_ERROR_CODES;
    message: string;
  };
}

enum CONNECT_EVENT_ERROR_CODES {
  UNKNOWN_ERROR = 0,
  BAD_REQUEST_ERROR = 1,
  MANIFEST_NOT_FOUND_ERROR = 2,
  MANIFEST_CONTENT_ERROR = 3,
  UNKNOWN_APP_ERROR = 100,
  USER_REJECTS_ERROR = 300,
  METHOD_NOT_SUPPORTED = 400,
}

type ConnectEvent = ConnectEventSuccess | ConnectEventError;

type RpcMethod = 'disconnect' | 'sendTransaction' | 'signData';

interface SendTransactionRpcRequest {
  method: 'sendTransaction';
  params: [string];
  id: string;
}

interface SignDataRpcRequest {
  method: 'signData';
  params: [
    {
      schema_crc: number;
      cell: string;
    }
  ];
  id: string;
}

interface DisconnectRpcRequest {
  method: 'disconnect';
  params: [];
  id: string;
}

type RpcRequests = {
  sendTransaction: SendTransactionRpcRequest;
  signData: SignDataRpcRequest;
  disconnect: DisconnectRpcRequest;
};

type AppRequest<T extends RpcMethod> = RpcRequests[T];

interface DisconnectEvent {
  event: 'disconnect';
  id: number;
  payload: object;
}

type WalletEvent = ConnectEvent | DisconnectEvent;

enum SEND_TRANSACTION_ERROR_CODES {
  UNKNOWN_ERROR = 0,
  BAD_REQUEST_ERROR = 1,
  UNKNOWN_APP_ERROR = 100,
  USER_REJECTS_ERROR = 300,
  METHOD_NOT_SUPPORTED = 400,
}

interface WalletResponseTemplateError {
  error: { code: number; message: string; data?: unknown };
  id: string;
}

interface SendTransactionRpcResponseError extends WalletResponseTemplateError {
  error: {
    code: SEND_TRANSACTION_ERROR_CODES;
    message: string;
    data?: unknown;
  };
  id: string;
}

interface WalletResponseTemplateSuccess {
  result: string;
  id: string;
}

type SendTransactionRpcResponseSuccess = WalletResponseTemplateSuccess;

enum SIGN_DATA_ERROR_CODES {
  UNKNOWN_ERROR = 0,
  BAD_REQUEST_ERROR = 1,
  UNKNOWN_APP_ERROR = 100,
  USER_REJECTS_ERROR = 300,
  METHOD_NOT_SUPPORTED = 400,
}

interface SignDataRpcResponseError extends WalletResponseTemplateError {
  error: { code: SIGN_DATA_ERROR_CODES; message: string; data?: unknown };
  id: string;
}

interface SignDataRpcResponseSuccess {
  id: string;
  result: {
    signature: string;
    timestamp: string;
  };
}

enum DISCONNECT_ERROR_CODES {
  UNKNOWN_ERROR = 0,
  BAD_REQUEST_ERROR = 1,
  UNKNOWN_APP_ERROR = 100,
  METHOD_NOT_SUPPORTED = 400,
}

interface DisconnectRpcResponseError extends WalletResponseTemplateError {
  error: { code: DISCONNECT_ERROR_CODES; message: string; data?: unknown };
  id: string;
}

interface DisconnectRpcResponseSuccess {
  id: string;
  result: object;
}

type RpcResponses = {
  sendTransaction: {
    error: SendTransactionRpcResponseError;
    success: SendTransactionRpcResponseSuccess;
  };

  signData: {
    error: SignDataRpcResponseError;
    success: SignDataRpcResponseSuccess;
  };

  disconnect: {
    error: DisconnectRpcResponseError;
    success: DisconnectRpcResponseSuccess;
  };
};

type WalletResponseSuccess<T extends RpcMethod> = RpcResponses[T]['success'];

type WalletResponseError<T extends RpcMethod> = RpcResponses[T]['error'];

type WalletResponse<T extends RpcMethod> =
  | WalletResponseSuccess<T>
  | WalletResponseError<T>;

export interface TonProvider {
  deviceInfo: DeviceInfo;
  walletInfo: WalletInfo;
  protocolVersion: number;
  isWalletBrowser: boolean;
  connect(
    protocolVersion: number,
    message: ConnectRequest
  ): Promise<ConnectEvent>;
  restoreConnection(): Promise<ConnectEvent>;
  send<T extends RpcMethod>(message: AppRequest<T>): Promise<WalletResponse<T>>;
  listen(callback: (event: WalletEvent) => void): () => void;

  /**
   * @deprecated
   */
  disconnect(): void;
}

export const isTonAddressItemReply = (
  item: ConnectItemReply
): item is TonAddressItemReply => item.name === 'ton_addr';
