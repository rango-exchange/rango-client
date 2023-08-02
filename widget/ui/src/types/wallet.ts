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

interface Wallet {
  chain: string;
  address: string;
  walletType: WalletType;
}

export type TokenBalance = {
  chain: string;
  symbol: string;
  ticker: string;
  address: string | null;
  rawAmount: string;
  decimal: number | null;
  amount: string;
  logo: string | null;
  usdPrice: number | null;
};

export interface ConnectedWallet extends Wallet {
  balances: TokenBalance[] | null;
  loading: boolean;
  error: boolean;
  explorerUrl: string | null;
}
