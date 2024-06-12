import type { ProviderInfo } from '@rango-dev/wallets-core';
import type {
  NamespaceAndNetwork,
  WalletActions,
  WalletConfig,
  EventHandler as WalletEventHandler,
  LegacyState as WalletState,
} from '@rango-dev/wallets-core/legacy';
import type { Versions } from '@rango-dev/wallets-core/utils';
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
  /**
   * `Provider` in legacy terms means injected instances by wallets into window (e.g. window.ethereum)
   * that can be retrieved by `getInstance`.
   *
   * Note 1: Providers are lazy evaluated, which means you need to call `connect` (or `state`) first, then the value will be shown in object.
   *         before doing that, it's a key (wallet name or we call it `type` to be more specific) with null value. (e.g. {metamask: null})
   */
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
