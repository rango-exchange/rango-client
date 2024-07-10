import type { LegacyState as WalletState } from './wallet.js';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

export type WalletType = string;
export type Network = string;

// TODO: This should be removed. since it's rango-related stuff.
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

  // Using instead of null
  Unknown = 'Unkown',
}
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
  color: string;
  supportedChains: BlockchainMeta[];
  showOnMobile?: boolean;
  isContractWallet?: boolean;
  mobileWallet?: boolean;
  namespaces?: Namespace[];
  singleNamespace?: boolean;
};

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
  | (() => any)
  | ((options: GetInstanceOptions) => Promise<any>);

export type TryGetInstance =
  | (() => any)
  | ((options: Pick<GetInstanceOptions, 'force' | 'network'>) => Promise<any>);

export type Connect = (options: {
  instance: any;
  network?: Network;
  meta: BlockchainMeta[];
  namespaces?: Namespace[];
}) => Promise<ProviderConnectResult | ProviderConnectResult[]>;

export type Disconnect = (options: {
  instance: any;
  destroyInstance: () => void;
}) => Promise<void>;

type CleanupSubscribe = () => void;

export type Subscribe = (options: {
  instance: any;
  state: WalletState;
  meta: BlockchainMeta[];
  updateChainId: (chainId: string) => void;
  updateAccounts: (accounts: string[], chainId?: string) => void;
  connect: (network?: Network) => void;
  disconnect: () => void;
}) => CleanupSubscribe | void;

export type SwitchNetwork = (options: {
  instance: any;
  network: Network;
  meta: BlockchainMeta[];
  newInstance?: TryGetInstance;
  getState?: () => WalletState;
  updateChainId: (chainId: string) => void;
}) => Promise<void>;

export type Suggest = (options: {
  instance: any;
  network: Network;
  meta: BlockchainMeta[];
}) => Promise<void>;

export type CanSwitchNetwork = (options: {
  network: Network;
  /**
   * the data will be retrieved from `getWalletInfo().supportedChains` as `meta`.
   */
  meta: BlockchainMeta[];
  provider: any;
}) => boolean;

export type CanEagerConnect = (options: {
  instance: any;
  meta: BlockchainMeta[];
}) => Promise<boolean>;

export interface WalletActions {
  connect: Connect;
  getInstance: any;
  disconnect?: Disconnect;
  subscribe?: Subscribe;
  // unsubscribe, // coupled to subscribe.

  // Optional, but should be provided at the same time.
  suggest?: Suggest;
  switchNetwork?: SwitchNetwork;
  getSigners: (provider: any) => SignerFactory;
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

export type LegacyProviderInterface = { config: WalletConfig } & WalletActions;

export type NamespacesWithDiscoverMode = Namespace | 'DISCOVER_MODE';

export type NamespaceWithDiscoverMode = {
  namespace: 'DISCOVER_MODE';
  network: string;
};
export type NamespaceAndNetwork<T extends Namespace = Namespace> =
  | {
      /**
       * By default, you should specify namespace (e.g. evm).
       * For backward compatibility with legacy implementation, DISCOVER_MODE will try to map a list of known (and hardcoded) networks to a namespace.
       */
      namespace: T;
      /**
       * In some cases, we need to connect a specific network on a namespace. e.g. Polygon on EVM.
       */
      network: NetworkTypeForNamespace<T>;
    }
  | NamespaceWithDiscoverMode;

export enum Namespace {
  Solana = 'solana',
  Evm = 'evm',
  Cosmos = 'cosmos',
  Utxo = 'utxo',
  Starknet = 'starknet',
  Tron = 'tron',
}

interface NamespaceNetworkType {
  [Namespace.Evm]: string;
  [Namespace.Solana]: undefined;
  [Namespace.Cosmos]: string;
  [Namespace.Utxo]: string;
  [Namespace.Starknet]: string;
  [Namespace.Tron]: string;
}

export type NetworkTypeForNamespace<T extends NamespacesWithDiscoverMode> =
  T extends 'DISCOVER_MODE'
    ? string
    : T extends Namespace
    ? NamespaceNetworkType[T]
    : never;