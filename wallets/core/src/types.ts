import { Network, WalletType, WalletInfo } from '@rango-dev/wallets-shared';
import { State as WalletState } from './wallet';
import { SignerFactory, StdBlockchainInfo } from 'rango-types';

export type State = {
  [key: string]: WalletState | undefined;
};

export type ConnectResult = {
  accounts: string[] | null;
  network: Network | null;
  provider: any;
};

export type Providers = { [type in WalletType]?: any };

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
  meta: StdBlockchainInfo[];
  getState: () => WalletState;
  /**
   * We always get the instance once and reuse it whenever we needs. By using this option
   * We can force the library to get a new instance and replace it with the old one.
   *
   * Originally, we used this option for wallet connect 1 and its switching network challenge.
   */
  force?: boolean;
  updateChainId: (chainId: number | string) => void;
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
  meta: StdBlockchainInfo[];
}) => Promise<ProviderConnectResult | ProviderConnectResult[]>;

export type Disconnect = (options: {
  instance: any;
  destroyInstance: () => void;
}) => Promise<void>;

export type Subscribe = (options: {
  instance: any;
  state: WalletState;
  meta: StdBlockchainInfo[];
  updateChainId: (chainId: string) => void;
  updateAccounts: (accounts: string[], chainId?: string) => void;
  connect: (network?: Network) => void;
  disconnect: () => void;
}) => void;

export type SwitchNetwork = (options: {
  instance: any;
  network: Network;
  meta: StdBlockchainInfo[];
  newInstance?: TryGetInstance;
}) => Promise<void>;

export type CanSwitchNetwork = (options: {
  network: Network;
  meta: StdBlockchainInfo[];
  provider: any;
}) => boolean;

export type CanEagerConnect = (options: {
  instance: any;
  meta: StdBlockchainInfo[];
}) => Promise<boolean>;

export interface WalletActions {
  connect: Connect;
  getInstance: any;
  disconnect?: Disconnect;
  subscribe?: Subscribe;
  // unsubscribe, // coupled to subscribe.

  // Optional, but should be provided at the same time.
  switchNetwork?: SwitchNetwork;
  getSigners: (provider: any) => SignerFactory;
  canSwitchNetworkTo?: CanSwitchNetwork;
  canEagerConnect?: CanEagerConnect;
  getWalletInfo(allBlockChains: StdBlockchainInfo[]): WalletInfo;
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

export type ProviderInterface = { config: WalletConfig } & WalletActions;
