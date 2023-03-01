import { LiquiditySource } from '@rangodev/ui/dist/types/meta';
import { WalletType } from '@rangodev/wallets-shared';
import { BlockchainMeta, Token } from 'rango-sdk';

export type Value =
  | string
  | Token
  | BlockchainMeta
  | Token[]
  | BlockchainMeta[]
  | boolean
  | string[]
  | LiquiditySource[]
  | WalletType[];

export type ConfigType = {
  fromChain: BlockchainMeta | null;
  fromToken: Token | null;
  toChain: BlockchainMeta | null;
  toToken: Token | null;
  fromAmount: number;
  fromChains: 'all' | BlockchainMeta[];
  fromTokens: 'all' | Token[];
  toChains: 'all' | BlockchainMeta[];
  toTokens: 'all' | Token[];
  liquiditySources: 'all' | LiquiditySource[];
  wallets: 'all' | WalletType[];
  multiChain: boolean;
  customeAddress: boolean;
};

export type StyleType = {
  theme: 'dark' | 'light' | 'auto';
  title: string;
  width: number;
  height: number;
  languege: string;
  borderRadius: number;
  fontFaminy: string;
  titleSize: number;
  titelsWeight: number;
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
