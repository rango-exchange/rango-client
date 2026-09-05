import type { ProviderMetadata } from '@hub3js/core';
import type {
  LegacyNetwork as Network,
  LegacyWalletInfo as WalletInfo,
  LegacyState as WalletState,
  LegacyWalletType as WalletType,
} from '@rango-dev/wallets-core/legacy';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

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

export type ExtendedWalletInfo = WalletInfo & {
  properties?: ProviderMetadata['properties'];
  isHub?: boolean;
};

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
