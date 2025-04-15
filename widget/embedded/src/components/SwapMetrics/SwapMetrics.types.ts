import type { QuoteError, QuoteWarning, SelectedQuote } from '../../types';
import type { TokenData } from '../TokenList/TokenList.types';
import type { SwapResultAsset } from 'rango-sdk';

export interface PropTypes {
  quoteError: QuoteError | null;
  quoteWarning: QuoteWarning | null;
  fromToken: TokenData;
  toToken: TokenData;
  quote: SelectedQuote | null;
  loading: boolean;
}

export type Tokens = {
  to: TokenData | SwapResultAsset;
  from: TokenData | SwapResultAsset;
};

export type SlippageColorParams = {
  error: { quoteError: QuoteError | null; slippageError: string | null };
  warning: {
    quoteWarning: QuoteWarning | null;
    slippageWarning: string | null;
  };
  isDarkTheme: boolean;
};
