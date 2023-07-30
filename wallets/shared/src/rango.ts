import type { BlockchainMeta, EvmBlockchainMeta } from 'rango-types';

export const IS_DEV =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const getBlockChainNameFromId = (
  chainId: string | number,
  blockchains: BlockchainMeta[]
): Network | null => {
  chainId =
    typeof chainId === 'string' && chainId.startsWith('0x')
      ? parseInt(chainId)
      : chainId;

  // Sometimes providers are passing `Network` as chainId.
  // If chainId is a `Network`, we return itself.
  const allNetworks = Object.values(Networks) as string[];
  if (allNetworks.includes(String(chainId))) return chainId as Networks;

  if (chainId === 'Binance-Chain-Tigris') return Networks.BINANCE;
  return (
    blockchains
      .filter((blockchainMeta) => !!blockchainMeta.chainId)
      .find((blockchainMeta) => {
        const blockchainChainId = blockchainMeta.chainId?.startsWith('0x')
          ? parseInt(blockchainMeta.chainId)
          : blockchainMeta.chainId;
        return blockchainChainId == chainId;
      })?.name || null
  );
};

export const getBlockchainChainIdByName = (
  netwok: Network,
  allBlockChains: AllBlockchains
) => allBlockChains[netwok]?.chainId || null;

export const uint8ArrayToHex = (buffer: Uint8Array): string => {
  return Buffer.from(buffer).toString('hex');
};

export type WalletType = string;
export type Network = string;

export enum WalletTypes {
  META_MASK = 'metamask',
  WALLET_CONNECT = 'wallet-connect',
  WALLET_CONNECT_2 = 'wallet-connect-2',
  TRUST_WALLET = 'trust-wallet',
  KEPLR = 'keplr',
  PHANTOM = 'phantom',
  BINANCE_CHAIN = 'binance-chain',
  BITKEEP = 'bitkeep',
  TRON_LINK = 'tron-link',
  COINBASE = 'coinbase',
  XDEFI = 'xdefi',
  CLOVER = 'clover',
  ARGENTX = 'argentx',
  FRONTIER = 'frontier',
  COSMOSTATION = 'cosmostation',
  COIN98 = 'coin98',
  SAFEPAL = 'safepal',
  TOKEN_POCKET = 'token-pocket',
  BRAVE = 'brave',
  BRAAVOS = 'braavos',
  MATH = 'math',
  EXODUS = 'exodus',
  OKX = 'okx',
  KUCOIN = 'kucoin',
  LEAP = 'leap',
  LEAP_COSMOS = 'leap-cosmos',
  STATION = 'station',
  ENKRYPT = 'enkrypt',
  TAHO = 'taho',
}

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

  // Using instead of null
  Unknown = 'Unkown',
}

export const XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS = [
  Networks.BTC,
  Networks.LTC,
  Networks.THORCHAIN,
  Networks.BCH,
  Networks.BINANCE,
];

export const KEPLR_COMPATIBLE_WALLETS = [
  WalletTypes.KEPLR,
  WalletTypes.COSMOSTATION,
];

export type Asset = {
  blockchain: Network;
  symbol: string;
  address: string | null;
};

export type AllBlockchains = { [key: string]: BlockchainMeta };

export type AddEthereumChainParameter = {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
};

export type EvmNetworksChainInfo = { [key: string]: AddEthereumChainParameter };

export interface Meta {
  blockchains: AllBlockchains;
  evmNetworkChainInfo: EvmNetworksChainInfo;
  getSupportedChainNames: (type: WalletType) => Network[] | null;
  evmBasedChains: EvmBlockchainMeta[];
}

// core

// wallets/core/src/wallet.ts -> State
export interface WalletState {
  connected: boolean;
  connecting: boolean;
  reachable: boolean;
  installed: boolean;
  accounts: string[] | null;
  network: Network | null;
}

export interface WalletConfig {
  type: WalletType;
  defaultNetwork?: Network;
  checkInstallation?: boolean;
  isAsyncInstance?: boolean;
}

export type GetInstanceOptions = {
  network?: Network;
  currentProvider: any;
  meta: BlockchainMeta[];
  force?: boolean;
  updateChainId: (chainId: number | string) => void;
};

export type TryGetInstance =
  | (() => any)
  | ((options: Pick<GetInstanceOptions, 'force' | 'network'>) => Promise<any>);

export type GetInstance =
  | (() => any)
  | ((options: GetInstanceOptions) => Promise<any>);

export type ProviderConnectResult = {
  accounts: string[];
  chainId: string;
};

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

export type CanEagerConnect = (options: {
  instance: any;
  meta: BlockchainMeta[];
}) => Promise<boolean>;

export type SwitchNetwork = (options: {
  instance: any;
  network: Network;
  meta: BlockchainMeta[];
  newInstance?: TryGetInstance;
}) => Promise<void>;

export type CanSwitchNetwork = (options: {
  network: Network;
  meta: BlockchainMeta[];
  provider: any;
}) => boolean;

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
  mobileWallet?: boolean;
};

export interface Wallet {
  type: WalletType;
  extensionAvailable: boolean;
  connected: boolean;
  info: Omit<WalletInfo, 'color' | 'supportedChains'>;
}
