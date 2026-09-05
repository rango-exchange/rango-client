import type { ConnectResult, ExtendedWalletInfo } from './legacy/types.js';
import type { Provider } from '@hub3js/core';
import type { NamespaceData } from '@hub3js/core/store';
import type { VersionedProviders } from '@hub3js/core/utils';
import type { Namespace } from '@hub3js/namespaces';
import type {
  LegacyNamespaceInputForConnect,
  LegacyProviderInterface,
  LegacyNetwork as Network,
  LegacyEventHandler as WalletEventHandler,
  LegacyState as WalletState,
  LegacyWalletType as WalletType,
} from '@rango-dev/wallets-core/legacy';
import type { BlockchainMeta, SignerFactory } from 'rango-types';
import type { PropsWithChildren } from 'react';

export type ProviderContext = {
  connect(
    type: WalletType,
    namespaces?: LegacyNamespaceInputForConnect[]
  ): Promise<ConnectResult[]>;
  disconnect(type: WalletType, namespaces?: Namespace[]): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disconnectAll(): Promise<PromiseSettledResult<any>[]>;

  state(
    type: WalletType
  ): WalletState & { namespaces?: Map<Namespace, NamespaceData> };
  canSwitchNetworkTo(
    type: WalletType,
    network: Network,
    namespace?: LegacyNamespaceInputForConnect
  ): boolean;
  getSigners(type: WalletType): Promise<SignerFactory>;
  getWalletInfo(type: WalletType): ExtendedWalletInfo;
  suggestAndConnect(
    type: WalletType,
    namespace: LegacyNamespaceInputForConnect
  ): Promise<ConnectResult>;
  hubProvider(type: WalletType): Provider;
};

export type ProviderProps = PropsWithChildren<{
  onUpdateState?: WalletEventHandler;
  allBlockChains?: BlockchainMeta[];
  autoConnect?: boolean;
  providers: VersionedProviders[];
  configs?: {
    wallets?: (WalletType | LegacyProviderInterface | Provider)[];
    walletOptions?: {
      [key: WalletType]: {
        provider?: unknown;
        namespaces?: {
          [namespaceId: string]: unknown;
        };
      };
    };
  };
}>;
