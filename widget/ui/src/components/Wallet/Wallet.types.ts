import type { InstallObjects, WalletType } from '@rango-dev/wallets-shared';

export enum WalletState {
  NOT_INSTALLED = 'not_installed',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
}

export type WalletInfo = {
  state: WalletState;
  link: InstallObjects | string;
  title: string;
  image: string;
  type: string;
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
};
