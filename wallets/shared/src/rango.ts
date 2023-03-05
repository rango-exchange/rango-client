import {
  StarknetTransaction,
  TronTransaction,
  isEvmBlockchain,
  isCosmosBlockchain,
  isSolanaBlockchain,
  isTronBlockchain,
  isStarknetBlockchain,
  isTransferBlockchain,
  CosmosChainInfo,
  EVMChainInfo,
  BlockchainMeta,
  EvmBlockchainMeta,
  CosmosBlockchainMeta,
  SolanaBlockchainMeta,
  TransferBlockchainMeta,
  TronBlockchainMeta,
  StarkNetBlockchainMeta,
  evmBlockchains,
  cosmosBlockchains,
  starknetBlockchain,
  tronBlockchain,
  transferBlockchains,
  solanaBlockchain,
  TransactionType,
} from 'rango-types';
import {
  CosmosTransaction,
  EvmTransaction,
  SolanaTransaction,
  Transfer,
} from 'rango-types/lib/api/main';

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
  const allNetworks = Object.values(Network) as string[];
  if (allNetworks.includes(String(chainId))) return chainId as Network;

  if (chainId === 'Binance-Chain-Tigris') return Network.BINANCE;
  return (
    (blockchains
      .filter((blockchainMeta) => !!blockchainMeta.chainId)
      .find((blockchainMeta) => {
        const blockchainChainId = blockchainMeta.chainId?.startsWith('0x')
          ? parseInt(blockchainMeta.chainId)
          : blockchainMeta.chainId;
        return blockchainChainId == chainId;
      })?.name as Network) || null
  );
};

export const getBlockchainChainIdByName = (
  netwok: Network,
  allBlockChains: AllBlockchains
) => allBlockChains[netwok]?.chainId || null;

export const uint8ArrayToHex = (buffer: Uint8Array): string => {
  return Buffer.from(buffer).toString('hex');
};

export enum WalletType {
  META_MASK = 'metamask',
  WALLET_CONNECT = 'wallet-connect',
  TRUST_WALLET = 'trust-wallet',
  TERRA_STATION = 'terra-station',
  KEPLR = 'keplr',
  PHANTOM = 'phantom',
  FRONTIER = 'frontier',
  COINBASE = 'coinbase',
  XDEFI = 'xdefi',
  BINANCE_CHAIN = 'binance-chain',
  LEAP = 'leap',
  LEAP_COSMOS = 'leap-cosmos',
  CLOVER = 'clover',
  COSMOSTATION = 'cosmostation',
  COIN98 = 'coin98',
  SAFEPAL = 'safepal',
  TOKEN_POCKET = 'token-pocket',
  BRAVE = 'brave',
  MATH = 'math',
  EXODUS = 'exodus',
  OKX = 'okx',
  ARGENTX = 'argentx',
  TRON_LINK = 'tron-link',
  KUCOIN = 'kucoin',
  UNKNOWN = 'unknown',
}

export enum Network {
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
  Network.BTC,
  Network.LTC,
  Network.THORCHAIN,
  Network.BCH,
  Network.BINANCE,
];

export const KEPLR_COMPATIBLE_WALLETS = [
  WalletType.KEPLR,
  WalletType.COSMOSTATION,
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

export type SwitchNetwork = (options: {
  instance: any;
  network: Network;
  meta: BlockchainMeta[];
  newInstance?: TryGetInstance;
}) => Promise<void>;

export type CanSwitchNetwork = (options: {
  network: Network;
  meta: BlockchainMeta[];
}) => boolean;

export type WalletSigners = {
  executeTransfer: (tx: Transfer, meta: Meta) => Promise<string>;
  executeEvmTransaction: (tx: EvmTransaction, meta: Meta) => Promise<string>;
  executeCosmosMessage: (tx: CosmosTransaction, meta: Meta) => Promise<string>;
  executeSolanaTransaction: (
    tx: SolanaTransaction,
    requestId: string
  ) => Promise<string>;
  executeStarknetTransaction: (
    tx: StarknetTransaction,
    meta: Meta
  ) => Promise<string>;
  executeTronTransaction: (tx: TronTransaction, meta: Meta) => Promise<string>;
  signMessage: (
    walletAddress: string,
    message: string,
    blockChain: string,
    meta: BlockchainMeta[]
  ) => Promise<string>;
};

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
};

export interface Wallet {
  type: WalletType;
  extensionAvailable: boolean;
  connected: boolean;
  info: Omit<WalletInfo, 'color' | 'supportedChains'>;
}

export type Transaction =
  | EvmTransaction
  | StarknetTransaction
  | TronTransaction
  | CosmosTransaction
  | SolanaTransaction
  | Transfer;

export {
  EvmTransaction,
  StarknetTransaction,
  TronTransaction,
  CosmosTransaction,
  SolanaTransaction,
  Transfer as TransferTransaction,
  isEvmBlockchain,
  isCosmosBlockchain,
  isSolanaBlockchain,
  isTronBlockchain,
  isStarknetBlockchain,
  isTransferBlockchain,
  evmBlockchains,
  cosmosBlockchains,
  starknetBlockchain,
  tronBlockchain,
  transferBlockchains,
  solanaBlockchain,
  BlockchainMeta,
  EvmBlockchainMeta,
  CosmosBlockchainMeta,
  SolanaBlockchainMeta,
  TransferBlockchainMeta,
  TronBlockchainMeta,
  StarkNetBlockchainMeta,
  CosmosChainInfo,
  EVMChainInfo,
  TransactionType,
};
