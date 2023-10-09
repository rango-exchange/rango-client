import type { Token } from 'rango-sdk';

export type TokenMeta = {
  blockchain: string;
  symbol: string;
  image: string;
  address: string | null;
  usdPrice: number | null;
  isSecondaryCoin: boolean;
  coinSource: string | null;
  coinSourceUrl: string | null;
  name: string | null;
  decimals: number;
  balance?: { amount: string; usdPrice: string };
};

export interface LiquiditySource {
  title: string;
  logo: string;
  type: 'BRIDGE' | 'AGGREGATOR' | 'DEX';
  selected: boolean;
}

export type LoadingStatus = 'loading' | 'success' | 'failed';

export interface TokenWithBalance extends Token {
  balance?: {
    amount: string;
    usdValue: string;
  };
}
