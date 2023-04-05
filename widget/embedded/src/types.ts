import { BlockchainMeta, Token } from 'rango-sdk';
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
  liquiditySources: 'all' | Source[];
  wallets: 'all' | WalletType[];
  multiWallets: boolean;
  customeAddress: boolean;
  theme: 'dark' | 'light' | 'auto';
  title: string;
  width: number;
  height: number;
  languege: string;
  borderRadius: number;
  fontFamily: string;
  titleSize: number;
  titelsWeight: number;
  colors: Colors;
};
