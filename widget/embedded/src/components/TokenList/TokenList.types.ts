import type { Token } from 'rango-sdk';

export interface TokenWithAmount extends Token {
  balance?: {
    amount: string;
    usdValue: string;
  };
}

export interface PropTypes {
  list: TokenWithAmount[];
  searchedFor: string;
  onChange: (token: TokenWithAmount) => void;
}
