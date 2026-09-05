import type {
  ConnectResult,
  EventHandler,
  ExtendedWalletInfo,
  NamespaceInputForConnect,
  WalletState,
} from './legacy/types.js';
import type { Provider, WalletType } from '@hub3js/core';
import type { NamespaceData as HubNamespaceData } from '@hub3js/core/store';
import type { VersionedProviders } from '@hub3js/core/utils';
import type { Namespace } from '@hub3js/namespaces';
import type { Network } from '@rango-dev/internal-blockchains';
import type { BlockchainMeta, SignerFactory } from 'rango-types';
import type { PropsWithChildren } from 'react';

export type ProviderContext = {
  connect(
    type: WalletType,
    namespaces?: NamespaceInputForConnect[]
  ): Promise<ConnectResult[]>;
  disconnect(type: WalletType, namespaces?: Namespace[]): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disconnectAll(): Promise<PromiseSettledResult<any>[]>;

  state(
    type: WalletType
  ): WalletState & { namespaces?: Map<Namespace, HubNamespaceData> };
  canSwitchNetworkTo(
    type: WalletType,
    network: Network,
    namespace?: NamespaceInputForConnect
  ): boolean;
  getSigners(type: WalletType): Promise<SignerFactory>;
  getWalletInfo(type: WalletType): ExtendedWalletInfo;
  suggestAndConnect(
    type: WalletType,
    namespace: NamespaceInputForConnect
  ): Promise<ConnectResult>;
  hubProvider(type: WalletType): Provider;
};

export type ProviderProps = PropsWithChildren<{
  onUpdateState?: EventHandler;
  allBlockChains?: BlockchainMeta[];
  autoConnect?: boolean;
  providers: VersionedProviders[];
  configs?: {
    wallets?: (WalletType | Provider)[];
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
