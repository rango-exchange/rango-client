import { BlockchainMeta, Token } from 'rango-sdk';
import { LiquiditySource } from '@rango-dev/ui/dist/types/meta';
import { WalletType } from '@rango-dev/wallets-shared';

export type Configs = {
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
