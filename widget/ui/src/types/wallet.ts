import { InstallObjects, WalletType } from '@rango-dev/wallets-shared';

export enum WalletState {
  NOT_INSTALLED = 'not installed',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
}

export type WalletInfo = {
  state:
    | WalletState.CONNECTED
    | WalletState.DISCONNECTED
    | WalletState.CONNECTING
    | WalletState.NOT_INSTALLED;
  installLink: InstallObjects | string;
  name: string;
  image: string;
  type: WalletType;
  showOnMobile: boolean;
};

export interface SelectableWallet {
  chain: string;
  walletType: WalletType;
  address: string;
  image: string;
  selected: boolean;
  name: string;
}
