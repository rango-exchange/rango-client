import type { BlockchainMeta, EvmBlockchainMeta } from 'rango-types';

import {
  type EvmNetworksChainInfo,
  Networks,
} from '@rango-dev/wallets-blockchains';
import {
  type LegacyWalletInfo as WalletInfo,
  type LegacyWalletType as WalletType,
} from '@rango-dev/wallets-core/legacy';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InstanceType = any;

export type {
  LegacyConnect as Connect,
  LegacyDisconnect as Disconnect,
  LegacySubscribe as Subscribe,
  LegacyCanEagerConnect as CanEagerConnect,
  LegacySwitchNetwork as SwitchNetwork,
  LegacySuggest as Suggest,
  LegacyCanSwitchNetwork as CanSwitchNetwork,
} from '@rango-dev/wallets-core/legacy';

export { Networks } from '@rango-dev/wallets-blockchains';

export const IS_DEV =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const uint8ArrayToHex = (buffer: Uint8Array): string => {
  return Buffer.from(buffer).toString('hex');
};

export type Network = string;

export const HYPERLIQUID_SIGN_NETWORK = Networks.ARBITRUM;

export type Asset = {
  blockchain: Network;
  symbol: string;
  address: string | null;
};

export type AllBlockchains = { [key: string]: BlockchainMeta };

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

export interface Wallet {
  type: WalletType;
  extensionAvailable: boolean;
  connected: boolean;
  info: Omit<WalletInfo, 'color'>;
}

export type Providers = { [type in WalletType]?: InstanceType };
