import type { Token } from 'rango-sdk';

export interface TokenWithBalance extends Token {
  balance?: {
    amount: string;
    usdValue: string;
  };
}

export interface PropTypes {
  list: TokenWithBalance[];
  searchedFor?: string;
  onChange: (token: TokenWithBalance) => void;
}

export interface LoadingTokenListProps {
  size: number;
}
