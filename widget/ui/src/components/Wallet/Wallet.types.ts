import type { TransactionType } from 'rango-types';

/** Id of a wallet (e.g. `metamask`). */
export type WalletType = string;

export type InstallObjects = {
  CHROME?: string;
  FIREFOX?: string;
  EDGE?: string;
  BRAVE?: string;
  DEFAULT: string;
};

/** Namespaces a wallet supports and how many of them can be selected at once. */
export type NeedsNamespace = {
  selection: 'single' | 'multiple';
  data: {
    label: string;
    id: string;
    value: string;
    unsupported?: boolean;
    isChainSupported: (chainId: string) => boolean;
  }[];
};

/** Namespaces of a wallet which need a derivation path to connect. */
export type NeedsDerivationPath = {
  data: {
    id: string;
    label: string;
    namespace: string;
    generateDerivationPath: (index: string) => string;
  }[];
};

export enum WalletState {
  NOT_INSTALLED = 'not_installed',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  PARTIALLY_CONNECTED = 'partially_connected',
}

export type WalletInfo = {
  state: WalletState;
  link: InstallObjects | string;
  title: string;
  image: string;
  type: string;
  showOnMobile?: boolean;
  blockchainTypes: TransactionType[];
  needsNamespace?: NeedsNamespace;
  needsDerivationPath?: NeedsDerivationPath;
};

export interface Info {
  color: string;
  description: string;
  tooltipText: string;
}

export interface ContentProps {
  image: string;
  title: string;
  description: string;
  descriptionColor?: string;
}

export interface WalletPropTypes {
  state: WalletState;
  title: string;
  image: string;
  link: InstallObjects | string;
  type: WalletType;
  onClick: (type: WalletType) => void;
  selected?: boolean;
  description?: string;
  isLoading?: boolean;
  container?: HTMLElement;
  disabled?: boolean;
}

export type SelectablePropTypes = WalletPropTypes & {
  selected: boolean;
  disabled?: boolean;
  id: string;
  descriptionColor: string;
};
