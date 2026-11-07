import type {
  DerivationPathProperty,
  NamespacesProperty,
  Provider,
  ProviderMetadata,
  WalletType,
} from '@hub3js/core';
import type { NamespaceData } from '@hub3js/core/store';
import type { Namespace } from '@hub3js/namespaces';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

export type NamespaceMeta = NamespacesProperty['value']['data'][number];

export type InstallObjects = {
  CHROME?: string;
  FIREFOX?: string;
  EDGE?: string;
  BRAVE?: string;
  DEFAULT: string;
};

export type ExtendedWalletInfo = {
  name: string;
  img: string;
  installLink: InstallObjects | string;
  supportedChains: BlockchainMeta[];
  showOnMobile?: boolean;
  isContractWallet?: boolean;
  mobileWallet?: boolean;
  needsDerivationPath?: DerivationPathProperty['value'];
  needsNamespace?: NamespacesProperty['value'];
  properties?: ProviderMetadata['properties'];
};

export type WalletState = {
  connected: boolean;
  connecting: boolean;
  /**
   * @deprecated it isn't used by the widget. It's kept since the queue manager still expects it.
   */
  reachable: boolean;
  installed: boolean;
  accounts: string[] | null;
  network: string | null;
  derivationPath?: string;
};

export type NamespaceInputForConnect = {
  namespace: Namespace;
  /**
   * Rango blockchain name, to connect a specific network on a namespace. e.g. Polygon on EVM.
   */
  network: string | undefined;
  derivationPath?: string;
};

export type ConnectResult = {
  accounts: string[] | null;
  network: string | null;
};

// Same values as the events `@rango-dev/wallets-react` reports through `onUpdateState`.
export const WalletControllerEvents = {
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  INSTALLED: 'installed',
  ACCOUNTS: 'accounts',
  NETWORK: 'network',
  NAMESPACE_DISCONNECTED: 'namespace_disconnected',
  PROVIDER_DISCONNECTED: 'provider_disconnected',
} as const;

export type WalletControllerEventInfo = {
  supportedBlockchains: BlockchainMeta[];
  isContractWallet: boolean;
  // Set alongside the ACCOUNTS event.
  namespace?: Namespace;
};

export type WalletControllerEventHandler = (
  type: WalletType,
  // One of `WalletControllerEvents`; other events are ignored.
  event: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  state: WalletState,
  info: WalletControllerEventInfo
) => void;

export type WalletController = {
  connect(
    type: WalletType,
    namespaces?: NamespaceInputForConnect[]
  ): Promise<ConnectResult[]>;
  disconnect(type: WalletType, namespaces?: Namespace[]): Promise<void>;
  state(
    type: WalletType
  ): WalletState & { namespaces?: Map<Namespace, NamespaceData> };
  canSwitchNetworkTo(
    type: WalletType,
    network: string,
    namespace?: NamespaceInputForConnect
  ): boolean;
  getSigners(type: WalletType): Promise<SignerFactory>;
  getWalletInfo(type: WalletType): ExtendedWalletInfo;
  hubProvider(type: WalletType): Provider;
  subscribe(handler: WalletControllerEventHandler): () => void;
};
