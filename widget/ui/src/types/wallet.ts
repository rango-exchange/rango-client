import { WalletType } from "@rangodev/wallets-shared";

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
  installLink: string;
  name: string;
  image: string;
  type: WalletType;
};
