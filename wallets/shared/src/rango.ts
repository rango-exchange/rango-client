import type { BlockchainMeta } from 'rango-types';

import {
  type LegacyState,
  type LegacyNetwork as Network,
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

export const IS_DEV =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const uint8ArrayToHex = (buffer: Uint8Array): string => {
  return Buffer.from(buffer).toString('hex');
};

// core

export type GetInstanceOptions = {
  network?: Network;
  currentProvider: InstanceType;
  meta: BlockchainMeta[];
  force?: boolean;
  updateChainId: (chainId: number | string) => void;
  getState: () => LegacyState;
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
