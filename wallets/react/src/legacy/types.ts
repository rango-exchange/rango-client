import type {
  NamespaceAndNetwork,
  ProviderInfo,
  V1,
  Versions,
  VLegacy,
  WalletActions,
  WalletConfig,
  EventHandler as WalletEventHandler,
  LegacyState as WalletState,
} from '@rango-dev/wallets-core';
import type {
  Network,
  WalletInfo,
  WalletType,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';
import type { PropsWithChildren } from 'react';

export type State = {
  [key: string]: WalletState | undefined;
};

export type ConnectResult = {
  accounts: string[] | null;
  network: Network | null;
  provider: any;
};

export type Providers = { [type in WalletType]?: any };

export type ExtendedWalletInfo = WalletInfo & {
  properties?: ProviderInfo['properties'];
};

export type ProviderContext = {
  /**
   *
   * @param type String
   * @param network String CAIP-2 e.g. eip155:1
   */
  connect(
    type: WalletType,
    namespaces?: NamespaceAndNetwork[]
  ): Promise<ConnectResult[]>;
  disconnect(type: WalletType): Promise<void>;
  disconnectAll(): Promise<PromiseSettledResult<any>[]>;
  state(type: WalletType): WalletState;
  canSwitchNetworkTo(type: WalletType, network: Network): boolean;
  providers(): Providers;
  getSigners(type: WalletType): SignerFactory;
  getWalletInfo(type: WalletType): ExtendedWalletInfo;
  suggestAndConnect(type: WalletType, network: Network): Promise<ConnectResult>;
};

export type ProviderProps = PropsWithChildren<{
  onUpdateState?: WalletEventHandler;
  allBlockChains?: BlockchainMeta[];
  autoConnect?: boolean;
  providers: Versions[];
  configs?: {
    isExperimentalEnabled?: boolean;
  };
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

export type WalletProviders = Map<
  WalletType,
  {
    actions: WalletActions;
    config: WalletConfig;
  }
>;

export type { VLegacy, V1, WalletActions, WalletConfig };
