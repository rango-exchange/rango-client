import type { ConfirmSwapWarnings, QuoteError, Wallet } from '../../types';
import type { ConfirmRouteResponse } from 'rango-sdk';

export type ConfirmSwapFetchResult = {
  quoteData: ConfirmRouteResponse['result'] | null;
  error: QuoteError | null;
  warnings: ConfirmSwapWarnings | null;
};

export type ConfirmSwap = {
  loading: boolean;
  fetch: (params: Params) => Promise<ConfirmSwapFetchResult>;
  cancelFetch: () => void;
  addSwap: (quoteData: ConfirmRouteResponse['result']) => Promise<void>;
};

export type Params = {
  selectedWallets: Wallet[];
  customDestination: string | null;
};
