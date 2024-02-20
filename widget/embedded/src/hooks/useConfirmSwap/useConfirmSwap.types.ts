import type { ConfirmSwapWarnings, QuoteError, Wallet } from '../../types';
import type { PendingSwap } from 'rango-types';

export type ConfirmSwapFetchResult = {
  swap: PendingSwap | null;
  error: QuoteError | null;
  warnings: ConfirmSwapWarnings | null;
};

export type ConfirmSwap = {
  loading: boolean;
  fetch: (params: Params) => Promise<ConfirmSwapFetchResult>;
  cancelFetch: () => void;
};

export type Params = {
  selectedWallets: Wallet[];
  customDestination: string | null;
};
