import type { Token } from 'rango-sdk';

export type LoadingStatus = 'loading' | 'success' | 'failed';

export interface TokenWithBalance extends Token {
  balance?: {
    amount: string;
    usdValue: string;
  };
}
