import type { Network, WalletType } from '@rango-dev/wallets-core/legacy';
import type { Namespaces } from '@rango-dev/wallets-core/namespaces/common';
import type { BlockchainMeta, EvmBlockchainMeta } from 'rango-types';

import { Networks } from '@rango-dev/wallets-core/legacy';

export type {
  WalletType,
  Network,
  Connect,
  Disconnect,
  Subscribe,
  CanEagerConnect,
  SwitchNetwork,
  Suggest,
  CanSwitchNetwork,
} from '@rango-dev/wallets-core/legacy';
export {
  Networks,
  getBlockChainNameFromId,
} from '@rango-dev/wallets-core/legacy';

export const IS_DEV =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const getBlockchainChainIdByName = (
  netwok: Network,
  allBlockChains: AllBlockchains
) => allBlockChains[netwok]?.chainId || null;

export const uint8ArrayToHex = (buffer: Uint8Array): string => {
  return Buffer.from(buffer).toString('hex');
};

export enum WalletTypes {
  DEFAULT = 'default',
  META_MASK = 'metamask',
  WALLET_CONNECT_2 = 'wallet-connect-2',
  TRUST_WALLET = 'trust-wallet',
  KEPLR = 'keplr',
  PHANTOM = 'phantom',
  BITGET = 'bitget',
  TRON_LINK = 'tron-link',
  COINBASE = 'coinbase',
  XDEFI = 'xdefi',
  CLOVER = 'clover',
  ARGENTX = 'argentx',
  FRONTIER = 'frontier',
  COSMOSTATION = 'cosmostation',
  COIN98 = 'coin98',
  SAFEPAL = 'safepal',
  SAFE = 'safe',
  TOKEN_POCKET = 'token-pocket',
  BRAVE = 'brave',
  BRAAVOS = 'braavos',
  MATH = 'math',
  EXODUS = 'exodus',
  OKX = 'okx',
  HALO = 'halo',
  LEAP = 'leap',
  LEAP_COSMOS = 'leap-cosmos',
  STATION = 'station',
  ENKRYPT = 'enkrypt',
  TAHO = 'taho',
  MY_TON_WALLET = 'mytonwallet',
  SOLFLARE_SNAP = 'solflare-snap',
  LEDGER = 'ledger',
}

export const XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS: string[] = [
  Networks.BTC,
  Networks.LTC,
  Networks.THORCHAIN,
  Networks.BCH,
  Networks.BINANCE,
  Networks.MAYA,
  Networks.DOGE,
];

export const KEPLR_COMPATIBLE_WALLETS: string[] = [
  WalletTypes.KEPLR,
  WalletTypes.COSMOSTATION,
  WalletTypes.LEAP_COSMOS,
];

export const DEFAULT_COSMOS_RPC_URL = 'https://cosmos-rpc.polkachu.com';

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
  isAsyncSwitchNetwork?: boolean;
}

export type GetInstanceOptions = {
  network?: Network;
  currentProvider: any;
  meta: BlockchainMeta[];
  force?: boolean;
  updateChainId: (chainId: number | string) => void;
  getState: () => WalletState;
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
  namespaces?: Namespaces[];
  singleNamespace?: boolean;
};

export interface Wallet {
  type: WalletType;
  extensionAvailable: boolean;
  connected: boolean;
  info: Omit<WalletInfo, 'color' | 'supportedChains'>;
}

export type Providers = { [type in WalletType]?: any };
