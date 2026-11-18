import type {
  DerivationPathProperty,
  NamespacesProperty,
  ProviderMetadata,
  WalletType,
} from '@hub3js/core';
import type { Namespace } from '@hub3js/namespaces';
import type { Network } from '@rango-dev/internal-blockchains';
import type { BlockchainMeta } from 'rango-types';

export type NamespaceMeta = NamespacesProperty['value']['data'][number];
export type NeedsNamespace = NamespacesProperty['value'];
export type NeedsDerivationPath = DerivationPathProperty['value'];

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
  /**
   * @deprecated we don't use this value anymore.
   */
  color: string;
  supportedChains: BlockchainMeta[];
  showOnMobile?: boolean;
  isContractWallet?: boolean;
  mobileWallet?: boolean;

  needsDerivationPath?: NeedsDerivationPath;
  needsNamespace?: NeedsNamespace;
};

export type WalletState = {
  connected: boolean;
  connecting: boolean;
  /**
   * @deprecated it always returns `false`. don't use it.
   */
  reachable: boolean;
  installed: boolean;
  accounts: string[] | null;
  network: Network | null;
  derivationPath?: string;
};

export type NamespaceInputForConnect<T extends Namespace = Namespace> = {
  /**
   * By default, you should specify namespace (e.g. evm).
   */
  namespace: T;
  /**
   * In some cases, we need to connect a specific network on a namespace. e.g. Polygon on EVM.
   */
  network: Network | undefined;
  derivationPath?: string;
};

export enum Events {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  REACHABLE = 'reachable',
  INSTALLED = 'installed',
  ACCOUNTS = 'accounts',
  NETWORK = 'network',
  // Hub only events
  NAMESPACE_DISCONNECTED = 'namespace_disconnected',

  PROVIDER_DISCONNECTED = 'provider_disconnected',
}

export type EventInfo = {
  supportedBlockchains: BlockchainMeta[];
  isContractWallet: boolean;
  isHub: boolean;
  // will be set alongside ACCOUNT event
  namespace?: Namespace;
  derivationPath?: string;
};

export type EventHandler = (
  type: WalletType,
  event: Events,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  coreState: WalletState,
  info: EventInfo
) => void;

export type ConnectResult = {
  accounts: string[] | null;
  network: Network | null;
};

export type ExtendedWalletInfo = WalletInfo & {
  properties?: ProviderMetadata['properties'];
  isHub?: boolean;
};
