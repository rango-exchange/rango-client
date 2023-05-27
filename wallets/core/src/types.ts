import { PropsWithChildren } from 'react';
import {
  Network,
  WalletType,
  WalletInfo,
  GetInstanceOptions,
  Connect,
  Subscribe,
  SwitchNetwork,
  CanSwitchNetwork,
} from '@rango-dev/wallets-shared';
import { EventHandler as WalletEventHandler, State as WalletState } from './wallet';
import { ProviderMeta, SignerFactory } from 'rango-types';

export type State = {
  [key: string]: WalletState | undefined;
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
  getSigners(type: WalletType): SignerFactory;
  getWalletInfo(type: WalletType): WalletInfo;
};

export type ProviderProps = PropsWithChildren<{
  onUpdateState?: WalletEventHandler;
  allBlockChains?: ProviderMeta[];
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

export type GetInstance = (() => any) | ((options: GetInstanceOptions) => Promise<any>);
export type TryGetInstance =
  | (() => any)
  | ((options: Pick<GetInstanceOptions, 'force' | 'network'>) => Promise<any>);

export type Disconnect = (options: { instance: any; destroyInstance: () => void }) => Promise<void>;

export interface WalletActions {
  connect: Connect;
  getInstance: any;
  disconnect?: Disconnect;
  subscribe?: Subscribe;
  // eagerConnect, // optional?
  // unsubscribe, // coupled to subscribe.

  // Optional, but should be provided at the same time.
  switchNetwork?: SwitchNetwork;
  getSigners: (provider: any) => SignerFactory;
  canSwitchNetworkTo?: CanSwitchNetwork;
  getWalletInfo(allBlockChains: ProviderMeta[]): WalletInfo;
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
