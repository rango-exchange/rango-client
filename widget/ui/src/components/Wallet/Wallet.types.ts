import { InstallObjects, WalletType } from '@rango-dev/wallets-shared';

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
  type: WalletType;
};

export interface SelectableWallet {
  chain: string;
  walletType: WalletType;
  address: string;
  image: string;
  selected: boolean;
  name: string;
}

export interface Info {
  color: string;
  description: string;
  tooltipText: string;
}

interface StateConnected {
  state: WalletState.CONNECTED;
}
interface StateDisconnected {
  state: WalletState.DISCONNECTED;
}
interface StateConnecting {
  state: WalletState.CONNECTING;
}
interface StateNotInstalled {
  state: WalletState.NOT_INSTALLED;
  link: InstallObjects | string;
}

type State =
  | StateConnected
  | StateDisconnected
  | StateConnecting
  | StateNotInstalled;

export interface ContentProps {
  image: string;
  title: string;
  description: string;
  descriptionColor?: string;
}

interface WalletProps {
  title: string;
  image: string;
  type: WalletType;
  onClick: (type: WalletType) => void;
}

export type SelectablePropTypes = WalletProps & {
  selected: boolean;
  description: string;
};

export type WalletPropTypes = State & WalletProps;
