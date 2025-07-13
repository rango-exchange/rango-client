import type { GenerateDeepLink } from '@rango-dev/wallets-core';
import type { LegacyWalletInfo } from '@rango-dev/wallets-core/legacy';
import type { InstallObjects, WalletType } from '@rango-dev/wallets-shared';
import type { TransactionType } from 'rango-types';

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
  generateDeepLink?: GenerateDeepLink;
  title: string;
  image: string;
  type: string;
  showOnMobile?: boolean;
  blockchainTypes: TransactionType[];
  needsNamespace?: LegacyWalletInfo['needsNamespace'];
  needsDerivationPath?: LegacyWalletInfo['needsDerivationPath'];
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
  deepLink?: string;
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
