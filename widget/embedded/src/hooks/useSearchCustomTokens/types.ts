import type { Token } from 'rango-sdk';

export type UseSearchCustomTokens = {
  fetch: (query: string, blockchain?: string) => void;
  cancel: () => void;
  loading: boolean;
  tokens: Token[];
  error: string | null;
};
