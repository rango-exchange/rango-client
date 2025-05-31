import type {
  LegacyNetwork as Network,
  LegacyWalletInfo as WalletInfo,
  LegacyWalletType as WalletType,
} from '@rango-dev/wallets-core/legacy';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';
import type { BlockchainMeta, EvmBlockchainMeta } from 'rango-types';

import { LegacyNetworks as Networks } from '@rango-dev/wallets-core/legacy';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InstanceType = any;

export type {
  LegacyNetwork as Network,
  LegacyConnect as Connect,
  LegacyDisconnect as Disconnect,
  LegacySubscribe as Subscribe,
  LegacyCanEagerConnect as CanEagerConnect,
  LegacySwitchNetwork as SwitchNetwork,
  LegacySuggest as Suggest,
  LegacyCanSwitchNetwork as CanSwitchNetwork,
  LegacyInstallObjects as InstallObjects,
  LegacyWalletInfo as WalletInfo,
  LegacyWalletType as WalletType,
  LegacyNamespaceData as NamespaceData,
} from '@rango-dev/wallets-core/legacy';

export {
  LegacyNetworks as Networks,
  legacyGetBlockChainNameFromId as getBlockChainNameFromId,
} from '@rango-dev/wallets-core/legacy';

export const IS_DEV =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

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
  LEDGER = 'ledger',
  Rabby = 'rabby',
  TOMO = 'tomo',
  TREZOR = 'trezor',
  SOLFLARE = 'solflare',
  SLUSH = 'slush',
  TON_CONNECT = 'tonconnect',
}

export const namespaces: Record<
  Namespace,
  { mainBlockchain: string; title: string; derivationPaths?: DerivationPath[] }
> = {
  EVM: {
    mainBlockchain: 'ETH',
    title: 'Ethereum',
    derivationPaths: [
      {
        id: 'metamask',
        label: `Metamask (m/44'/60'/0'/0/index)`,
        generateDerivationPath: (index: string) => `44'/60'/0'/0/${index}`,
      },
      {
        id: 'ledgerLive',
        label: `LedgerLive (m/44'/60'/index'/0/0)`,
        generateDerivationPath: (index: string) => `44'/60'/${index}'/0/0`,
      },
      {
        id: 'legacy',
        label: `Legacy (m/44'/60'/0'/index)`,
        generateDerivationPath: (index: string) => `44'/60'/0'/${index}`,
      },
    ],
  },
  Solana: {
    mainBlockchain: 'SOLANA',
    title: 'Solana',
    derivationPaths: [
      {
        id: `(m/44'/501'/index')`,
        label: `(m/44'/501'/index')`,
        generateDerivationPath: (index: string) => `44'/501'/${index}'`,
      },
      {
        id: `(m/44'/501'/0'/index)`,
        label: `(m/44'/501'/0'/index)`,
        generateDerivationPath: (index: string) => `44'/501'/0'/${index}`,
      },
    ],
  },
  Cosmos: {
    mainBlockchain: 'COSMOS',
    title: 'Cosmos',
  },
  UTXO: {
    title: 'UTXO',
    mainBlockchain: 'BTC',
  },
  Starknet: {
    title: 'Starknet',
    mainBlockchain: 'STARKNET',
  },
  Tron: {
    title: 'Tron',
    mainBlockchain: 'TRON',
  },
  Ton: {
    title: 'Ton',
    mainBlockchain: 'TON',
  },
  Sui: {
    mainBlockchain: 'SUI',
    title: 'Sui',
  },
};

export type DerivationPath = {
  id: string;
  label: string;
  generateDerivationPath: (index: string) => string;
};

export const XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS: string[] = [
  Networks.BTC,
  Networks.LTC,
  Networks.THORCHAIN,
  Networks.BCH,
  Networks.MAYA,
  Networks.DOGE,
];

export const KEPLR_COMPATIBLE_WALLETS: string[] = [
  WalletTypes.KEPLR,
  WalletTypes.COSMOSTATION,
  WalletTypes.LEAP_COSMOS,
  WalletTypes.XDEFI,
];

export const DEFAULT_COSMOS_RPC_URL = 'https://cosmos-rpc.polkachu.com';
export const ETHEREUM_CHAIN_ID = '0x1';
export const DEFAULT_ETHEREUM_RPC_URL =
  'https://rpc.ankr.com/eth/e21edd59bd22b103d89a51758a563ad2c7c33f5455eba21aa15251a42ff3645d';

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
  currentProvider: InstanceType;
  meta: BlockchainMeta[];
  force?: boolean;
  updateChainId: (chainId: number | string) => void;
  getState: () => WalletState;
};

export type TryGetInstance =
  | (() => InstanceType)
  | ((
      options: Pick<GetInstanceOptions, 'force' | 'network'>
    ) => Promise<InstanceType>);

export type GetInstance =
  | (() => InstanceType)
  | ((options: GetInstanceOptions) => Promise<InstanceType>);

export type ProviderConnectResult = {
  accounts: string[];
  chainId: string;
  derivationPath?: string;
};

export interface Wallet {
  type: WalletType;
  extensionAvailable: boolean;
  connected: boolean;
  info: Omit<WalletInfo, 'color'>;
}

export type Providers = { [type in WalletType]?: InstanceType };
