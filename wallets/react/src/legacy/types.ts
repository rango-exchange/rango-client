import type {
  GenerateDeepLink,
  ProviderInfo,
  VersionedProviders,
} from '@rango-dev/wallets-core';
import type {
  LegacyNamespaceInputForConnect,
  LegacyProviderInterface,
  LegacyNetwork as Network,
  LegacyEventHandler as WalletEventHandler,
  LegacyWalletInfo as WalletInfo,
  LegacyState as WalletState,
  LegacyWalletType as WalletType,
} from '@rango-dev/wallets-core/legacy';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';
import type { NamespaceData } from '@rango-dev/wallets-core/store';
import type { BlockchainMeta, SignerFactory } from 'rango-types';
import type { PropsWithChildren } from 'react';

import { LegacyEvents as Events } from '@rango-dev/wallets-core/legacy';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InstanceType = any;

export type State = {
  [key: string]: WalletState | undefined;
};

export type ConnectResult = {
  accounts: string[] | null;
  network: Network | null;
  provider: InstanceType;
};

export type Providers = { [type in WalletType]?: InstanceType };

export type ExtendedWalletInfo = WalletInfo & {
  properties?: ProviderInfo['properties'];
  isHub?: boolean;
};

export type ProviderContext = {
  connect(
    type: WalletType,
    namespaces?: LegacyNamespaceInputForConnect[]
  ): Promise<ConnectResult[]>;
  disconnect(type: WalletType, namespaces?: Namespace[]): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disconnectAll(): Promise<PromiseSettledResult<any>[]>;
  state(
    type: WalletType
  ): WalletState & { namespaces?: Map<Namespace, NamespaceData> };
  canSwitchNetworkTo(type: WalletType, network: Network): boolean;
  /**
   * `Provider` in legacy terms means injected instances by wallets into window (e.g. window.ethereum)
   * that can be retrieved by `getInstance`.
   *
   * Note 1: Providers are lazy evaluated, which means you need to call `connect` (or `state`) first, then the value will be shown in object.
   *         before doing that, it's a key (wallet name or we call it `type` to be more specific) with null value. (e.g. {metamask: null})
   */
  providers(): Providers;
  getSigners(type: WalletType): Promise<SignerFactory>;
  getWalletInfo(type: WalletType): ExtendedWalletInfo;
  suggestAndConnect(type: WalletType, network: Network): Promise<ConnectResult>;
};

export type ProviderProps = PropsWithChildren<{
  onUpdateState?: WalletEventHandler;
  allBlockChains?: BlockchainMeta[];
  autoConnect?: boolean;
  providers: VersionedProviders[];
  configs?: {
    wallets?: (WalletType | LegacyProviderInterface)[];
  };
}>;

export { Events };

export type ProviderConnectResult = {
  accounts: string[];
  chainId: string;
  derivationPath?: string;
};

export type GetInstanceOptions = {
  network?: Network;
  currentProvider: InstanceType;
  meta: BlockchainMeta[];
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
  | (() => InstanceType)
  | ((options: GetInstanceOptions) => Promise<InstanceType>);
export type TryGetInstance =
  | (() => InstanceType)
  | ((
      options: Pick<GetInstanceOptions, 'force' | 'network'>
    ) => Promise<InstanceType>);
export type Connect = (options: {
  instance: InstanceType;
  network?: Network;
  meta: BlockchainMeta[];
}) => Promise<ProviderConnectResult | ProviderConnectResult[]>;

export type Disconnect = (options: {
  instance: InstanceType;
  destroyInstance: () => void;
}) => Promise<void>;

type CleanupSubscribe = () => void;

export type Subscribe = (options: {
  instance: InstanceType;
  state: WalletState;
  meta: BlockchainMeta[];
  updateChainId: (chainId: string) => void;
  updateAccounts: (accounts: string[], chainId?: string) => void;
  connect: (network?: Network) => void;
  disconnect: () => void;
}) => CleanupSubscribe | void;

export type SwitchNetwork = (options: {
  instance: InstanceType;
  network: Network;
  meta: BlockchainMeta[];
  newInstance?: TryGetInstance;
  getState?: () => WalletState;
  updateChainId: (chainId: string) => void;
}) => Promise<void>;

export type Suggest = (options: {
  instance: InstanceType;
  network: Network;
  meta: BlockchainMeta[];
}) => Promise<void>;

export type CanSwitchNetwork = (options: {
  network: Network;
  meta: BlockchainMeta[];
  provider: InstanceType;
}) => boolean;

export type CanEagerConnect = (options: {
  instance: InstanceType;
  meta: BlockchainMeta[];
}) => Promise<boolean>;

export interface WalletActions {
  connect: Connect;
  getInstance: InstanceType;
  disconnect?: Disconnect;
  subscribe?: Subscribe;
  // unsubscribe, // coupled to subscribe.

  // Optional, but should be provided at the same time.
  suggest?: Suggest;
  switchNetwork?: SwitchNetwork;
  generateDeepLink?: GenerateDeepLink;
  getSigners: (provider: InstanceType) => Promise<SignerFactory>;
  canSwitchNetworkTo?: CanSwitchNetwork;
  canEagerConnect?: CanEagerConnect;
  getWalletInfo(allBlockChains: BlockchainMeta[]): WalletInfo;
}

export interface WalletConfig {
  type: WalletType;
  defaultNetwork?: Network;
  checkInstallation?: boolean;
  isAsyncInstance?: boolean;
  isAsyncSwitchNetwork?: boolean;
}

export type WalletProviders = Map<
  WalletType,
  {
    actions: WalletActions;
    config: WalletConfig;
  }
>;

export type ProviderInterface = { config: WalletConfig } & WalletActions;
