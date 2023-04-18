import { Asset } from 'rango-sdk';
import { WalletType } from '@rango-dev/wallets-shared';
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
};

export type Theme = {
  mode?: 'dark' | 'light' | 'auto';
  fontFamily?: string;
  colors?: Colors;
  titleSize?: number;
  titleWeight?: number;
  borderRadius?: number;
  width?: number;
  height?: number;
};
export type Support = {
  blockchain?: string;
  token?: Asset;
  blockchains?: string[];
  tokens?: Asset[];
};

export type WidgetConfig = {
  title?: string;
  amount?: number;
  from?: Support;
  to?: Support;
  liquiditySources?: Source[];
  wallets?: WalletType[];
  multiWallets?: boolean;
  customeAddress?: boolean;
  languege?: string;
  theme?: Theme;
};
