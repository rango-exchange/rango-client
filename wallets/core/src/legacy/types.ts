import type { State as WalletState } from './wallet.js';
import type { Namespace } from '../namespaces/common/mod.js';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

export enum Networks {
  BTC = 'BTC',
  BSC = 'BSC',
  LTC = 'LTC',
  THORCHAIN = 'THOR',
  BCH = 'BCH',
  BINANCE = 'BNB',
  ETHEREUM = 'ETH',
  POLYGON = 'POLYGON',
  TERRA = 'TERRA',
  POLKADOT = '',
  TRON = 'TRON',
  DOGE = 'DOGE',
  HARMONY = 'HARMONY',
  AVAX_CCHAIN = 'AVAX_CCHAIN',
  FANTOM = 'FANTOM',
  MOONBEAM = 'MOONBEAM',
  ARBITRUM = 'ARBITRUM',
  BOBA = 'BOBA',
  OPTIMISM = 'OPTIMISM',
  FUSE = 'FUSE',
  CRONOS = 'CRONOS',
  SOLANA = 'SOLANA',
  MOONRIVER = 'MOONRIVER',
  GNOSIS = 'GNOSIS',
  COSMOS = 'COSMOS',
  OSMOSIS = 'OSMOSIS',
  AXELAR = 'AXELAR',
  MARS = 'MARS',
  STRIDE = 'STRIDE',
  MAYA = 'MAYA',
  AKASH = 'AKASH',
  IRIS = 'IRIS',
  PERSISTENCE = 'PERSISTENCE',
  SENTINEL = 'SENTINEL',
  REGEN = 'REGEN',
  CRYPTO_ORG = 'CRYPTO_ORG',
  SIF = 'SIF',
  CHIHUAHUA = 'CHIHUAHUA',
  JUNO = 'JUNO',
  KUJIRA = 'KUJIRA',
  STARNAME = 'STARNAME',
  COMDEX = 'COMDEX',
  STARGAZE = 'STARGAZE',
  DESMOS = 'DESMOS',
  BITCANNA = 'BITCANNA',
  SECRET = 'SECRET',
  INJECTIVE = 'INJECTIVE',
  LUMNETWORK = 'LUMNETWORK',
  BANDCHAIN = 'BANDCHAIN',
  EMONEY = 'EMONEY',
  BITSONG = 'BITSONG',
  KI = 'KI',
  MEDIBLOC = 'MEDIBLOC',
  KONSTELLATION = 'KONSTELLATION',
  UMEE = 'UMEE',
  STARKNET = 'STARKNET',
  TON = 'TON',
  BASE = 'BASE',
  SUI = 'SUI',
  // Using instead of null
  Unknown = 'Unkown',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InstanceType = any;

export type NamespaceData = {
  namespace: Namespace;
  derivationPath?: string;
};

export type WalletType = string;
export type Network = string;

export type InstallObjects = {
  CHROME?: string;
  FIREFOX?: string;
  EDGE?: string;
  BRAVE?: string;
  DEFAULT: string;
};

export type NamespaceMeta = {
  label: string;
  /**
   * By using a matched `blockchain.name` (in meta) and `id`, we show logo in Namespace modal
   * e.g. ETH
   */
  id: string;
  value: Namespace;
  unsupported?: boolean;
  getSupportedChains: (chains: BlockchainMeta[]) => BlockchainMeta[];
};

interface NeedsNamespace {
  selection: 'single' | 'multiple';
  data: NamespaceMeta[];
}

interface NeedsDerivationPath {
  data: {
    id: string;
    label: string;
    namespace: Namespace;
    generateDerivationPath: (index: string) => string;
  }[];
}

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

export type State = {
  [key: string]: WalletState | undefined;
};

export type ConnectResult = {
  accounts: string[] | null;
  network: Network | null;
  provider: InstanceType;
};

export type Providers = { [type in WalletType]?: InstanceType };

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
  namespaces?: NamespaceData[];
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

export type EagerConnectResult<I = unknown> = {
  accounts: string[] | null;
  network: string | null;
  provider: I | null;
};

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

// it comes from wallets.ts and `connect`
type NetworkTypeFromLegacyConnect = Network | undefined;

export type NamespaceInputForConnect<T extends Namespace = Namespace> = {
  /**
   * By default, you should specify namespace (e.g. evm).
   */
  namespace: T;
  /**
   * In some cases, we need to connect a specific network on a namespace. e.g. Polygon on EVM.
   */
  network: NetworkTypeFromLegacyConnect;
  derivationPath?: string;
};
