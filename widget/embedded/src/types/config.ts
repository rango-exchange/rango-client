import { WalletType } from '@rangodev/wallets-shared';

export type ConfigType = {
  fromChain: string;
  fromToken: string;
  toChain: string;
  toToken: string;
  fromAmount: string;
  fromChains: string[];
  fromTokens: string[];
  toChains: string[];
  toTokens: string[];
  liquiditySources: string[];
  theme: 'dark' | 'light' | 'auto';
  wallets: string[];
  multiChain: boolean;
  customeAddress: boolean;
};

export type StyleType = {
  title: string;
  width: string;
  height: string;
  languege: string;
  borderRadius: string;
  fontFaminy: string;
  titleSize: string;
  titelsWeight: string;
  colors: {
    background: string;
    inputBackground: string;
    icons: string;
    primary: string;
    secondary: string;
    text: string;
    success: string;
    error: string;
    warning: string;
  };
};

export type Wallet = {
  title: string;
  logo: string;
  type: WalletType;
};

export type Wallets = Array<Wallet>;
