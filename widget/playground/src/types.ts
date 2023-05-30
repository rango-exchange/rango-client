import { ProviderContext, WalletProvider } from '@rango-dev/wallets-core';
import { WalletType } from '@rango-dev/wallets-shared';
import { Asset } from 'rango-sdk';

export type Wallet = {
  title: string;
  logo: string;
  type: WalletType;
};

export type Wallets = Array<Wallet>;

export type Type = 'Destination' | 'Source';

export interface Source {
  title: string;
  type: 'BRIDGE' | 'AGGREGATOR' | 'DEX';
}
export type Colors = {
  background?: string;
  // inputBackground?: string;
  // icons?: string;
  primary?: string;
  foreground?: string;
  // text?: string;
  success?: string;
  error?: string;
  warning?: string;
  surface?: string;
  neutral?: string;
};

export type Theme = {
  mode?: 'dark' | 'light' | 'auto';
  fontFamily?: string;
  colors: { light: Colors; dark: Colors };
  borderRadius?: number;
  width?: number;
  height?: number;
  singleTheme?: boolean;
};
export type Support = {
  blockchain?: string;
  token?: Asset;
  blockchains?: string[];
  tokens?: Asset[];
};

export type WidgetConfig = {
  apiKey: string;
  amount?: number;
  from: Support;
  to: Support;
  liquiditySources?: string[];
  wallets?: WalletType[];
  multiWallets?: boolean;
  customAddress?: boolean;
  language?: string;
  theme: Theme;
  externalProviders?: WalletProvider[];
  manageExternalWallets?: () => ProviderContext;
};
