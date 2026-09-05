import type {
  DerivationPathProperty,
  NamespacesProperty,
  ProviderMetadata,
  WalletType,
} from '@hub3js/core';
import type { Namespace } from '@hub3js/namespaces';
import type { Network } from '@rango-dev/internal-blockchains';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

export type NamespaceMeta = NamespacesProperty['value']['data'][number];
export type NeedsNamespace = NamespacesProperty['value'];
export type NeedsDerivationPath = DerivationPathProperty['value'];

export type InstallObjects = {
  CHROME?: string;
  FIREFOX?: string;
  EDGE?: string;
  BRAVE?: string;
  DEFAULT: string;
};

export type WalletInfo = {
  name: string;
  img: string;
  installLink: InstallObjects | string;
  /**
   * @deprecated we don't use this value anymore.
   */
  color: string;
  supportedChains: BlockchainMeta[];
  showOnMobile?: boolean;
  isContractWallet?: boolean;
  mobileWallet?: boolean;

  needsDerivationPath?: NeedsDerivationPath;
  needsNamespace?: NeedsNamespace;
};

export type WalletState = {
  connected: boolean;
  connecting: boolean;
  /**
   * @deprecated it always returns `false`. don't use it.
   */
  reachable: boolean;
  installed: boolean;
  accounts: string[] | null;
  network: Network | null;
  derivationPath?: string;
};

type NamespaceData = {
  namespace: Namespace;
  derivationPath?: string;
};

export type NamespaceInputForConnect<T extends Namespace = Namespace> = {
  /**
   * By default, you should specify namespace (e.g. evm).
   */
  namespace: T;
  /**
   * In some cases, we need to connect a specific network on a namespace. e.g. Polygon on EVM.
   */
  network: Network | undefined;
  derivationPath?: string;
};

export enum Events {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  REACHABLE = 'reachable',
  INSTALLED = 'installed',
  ACCOUNTS = 'accounts',
  NETWORK = 'network',
  // Hub only events
  NAMESPACE_DISCONNECTED = 'namespace_disconnected',

  PROVIDER_DISCONNECTED = 'provider_disconnected',
}

export type EventInfo = {
  supportedBlockchains: BlockchainMeta[];
  isContractWallet: boolean;
  isHub: boolean;
  // will be set alongside ACCOUNT event
  namespace?: Namespace;
  derivationPath?: string;
};

export type EventHandler = (
  type: WalletType,
  event: Events,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  coreState: WalletState,
  info: EventInfo
) => void;

export type ConnectResult = {
  accounts: string[] | null;
  network: Network | null;
};

export type ExtendedWalletInfo = WalletInfo & {
  properties?: ProviderMetadata['properties'];
  isHub?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InstanceType = any;

type ProviderConnectResult = {
  accounts: string[];
  chainId: string;
  derivationPath?: string;
};

type GetInstanceOptions = {
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

type TryGetInstance =
  | (() => InstanceType)
  | ((
      options: Pick<GetInstanceOptions, 'force' | 'network'>
    ) => Promise<InstanceType>);

type Connect = (options: {
  instance: InstanceType;
  network?: Network;
  meta: BlockchainMeta[];
  namespaces?: NamespaceData[];
}) => Promise<ProviderConnectResult | ProviderConnectResult[]>;

type Disconnect = (options: {
  instance: InstanceType;
  destroyInstance: () => void;
}) => Promise<void>;

type CleanupSubscribe = () => void;

type Subscribe = (options: {
  instance: InstanceType;
  state: WalletState;
  meta: BlockchainMeta[];
  updateChainId: (chainId: string) => void;
  updateAccounts: (accounts: string[], chainId?: string) => void;
  connect: (network?: Network) => void;
  disconnect: () => void;
}) => CleanupSubscribe | void;

type SwitchNetwork = (options: {
  instance: InstanceType;
  network: Network;
  meta: BlockchainMeta[];
  newInstance?: TryGetInstance;
  getState?: () => WalletState;
  updateChainId: (chainId: string) => void;
}) => Promise<void>;

type Suggest = (options: {
  instance: InstanceType;
  network: Network;
  meta: BlockchainMeta[];
}) => Promise<void>;

type CanSwitchNetwork = (options: {
  network: Network;
  meta: BlockchainMeta[];
  provider: InstanceType;
}) => boolean;

type CanEagerConnect = (options: {
  instance: InstanceType;
  meta: BlockchainMeta[];
}) => Promise<boolean>;

interface WalletActions {
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

interface WalletConfig {
  type: WalletType;
  defaultNetwork?: Network;
  checkInstallation?: boolean;
  isAsyncInstance?: boolean;
  isAsyncSwitchNetwork?: boolean;
}

/**
 * @deprecated Pass a hub `Provider` instead. This type will be removed in future versions.
 */
export type ProviderInterface = { config: WalletConfig } & WalletActions;
