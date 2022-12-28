import { PropsWithChildren } from 'react';
import {
  Network,
  WalletType,
  Meta,
  CosmosTransaction,
  EvmTransaction,
  SolanaTransaction,
  TransferTransaction,
  BlockchainMeta,
  WalletInfo,
} from '@rangodev/wallets-shared';
import {
  EventHandler as WalletEventHandler,
  State as WalletState,
} from './wallet';

export type State = {
  [key in WalletType]?: WalletState;
};

export type ConnectResult = {
  accounts: string[] | null;
  network: Network | null;
  provider: any;
};

export type Providers = { [type in WalletType]?: any };

export type ProviderContext = {
  connect(type: WalletType, network?: Network): Promise<ConnectResult>;
  disconnect(type: WalletType): Promise<void>;
  disconnectAll(): Promise<PromiseSettledResult<any>[]>;
  state(type: WalletType): WalletState;
  canSwitchNetworkTo(type: WalletType, network: Network): boolean;
  providers(): Providers;
  getSigners(type: WalletType): WalletSigners;
  getWalletInfo(type: WalletType): WalletInfo;
};

export type ProviderProps = PropsWithChildren<{
  onUpdateState?: WalletEventHandler;
  allBlockChains: BlockchainMeta[] | null;
  providers: WalletProvider[];
}>;

export enum Events {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  REACHABLE = 'reachable',
  INSTALLED = 'installed',
  ACCOUNTS = 'accounts',
  NETWORK = 'network',
}

export type ProviderConnectResult = {
  accounts: string[];
  chainId: string;
};

export type GetInstanceOptions = {
  network?: Network;
  currentProvider: any;
  meta: BlockchainMeta[];
  force?: boolean;
};
export type GetInstance =
  | (() => any)
  | ((options: GetInstanceOptions) => Promise<any>);
export type TryGetInstance =
  | (() => any)
  | ((options: Pick<GetInstanceOptions, 'force' | 'network'>) => Promise<any>);
export type Connect = (options: {
  instance: any;
  network?: Network;
  meta: BlockchainMeta[];
}) => Promise<ProviderConnectResult | ProviderConnectResult[]>;

export type Disconnect = (options: {
  instance: any;
  destroyInstance: () => void;
}) => Promise<void>;
export type Subscribe = (options: {
  instance: any;
  state: WalletState;
  meta: BlockchainMeta[];
  updateChainId: (chainId: string) => void;
  updateAccounts: (accounts: string[], chainId?: string) => void;
  connect: (network?: Network) => void;
  disconnect: () => void;
}) => void;

export type SwitchNetwork = (options: {
  instance: any;
  network: Network;
  meta: BlockchainMeta[];
  newInstance?: TryGetInstance;
}) => Promise<void>;

export type CanSwitchNetwork = (options: {
  network: Network;
  meta: BlockchainMeta[];
}) => boolean;

export interface WalletActions {
  connect: Connect;
  getInstance: any;
  disconnect?: Disconnect;
  subscribe?: Subscribe;
  // eagerConnect, // optional?
  // unsubscribe, // coupled to subscribe.

  // Optional, but should be provided at the same time.
  switchNetwork?: SwitchNetwork;
  getSigners: (provider: any) => WalletSigners;
  canSwitchNetworkTo?: CanSwitchNetwork;
  getWalletInfo(allBlockChains: BlockchainMeta[]): WalletInfo;
}

export interface WalletConfig {
  type: WalletType;
  defaultNetwork?: Network;
  checkInstallation?: boolean;
  isAsyncInstance?: boolean;
}

export type WalletProviders = Map<
  WalletType,
  {
    actions: WalletActions;
    config: WalletConfig;
  }
>;

export type WalletProvider = { config: WalletConfig } & WalletActions;

export type WalletSigners = {
  executeTransfer: (tx: TransferTransaction, meta: Meta) => Promise<string>;
  executeEvmTransaction: (tx: EvmTransaction, meta: Meta) => Promise<string>;
  executeCosmosMessage: (tx: CosmosTransaction, meta: Meta) => Promise<string>;
  executeSolanaTransaction: (
    tx: SolanaTransaction,
    requestId: string
  ) => Promise<string>;
  signEvmMessage: (walletAddress: string, message: string) => Promise<string>;
};
