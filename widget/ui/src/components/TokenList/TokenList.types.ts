import type { Asset, Token } from 'rango-sdk';

export interface TokenWithAmount extends Token {
  balance?: {
    amount: string;
    usdValue: string;
  };
}
export interface PropTypes {
  list: TokenWithAmount[];
  selected?: TokenWithAmount | null;
  searchedText: string;
  onChange: (token: TokenWithAmount) => void;
  multiSelect?: boolean;
  selectedList?: Asset[];
}
