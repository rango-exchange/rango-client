import type { UseSearchCustomTokens } from './types';
import type { Token } from 'rango-sdk';

import { useCallback, useRef, useState } from 'react';

import { httpService } from '../../services/httpService';
import { useAppStore } from '../../store/AppStore';
import { createAssetKey } from '../../store/utils/wallets';
import { debounce } from '../../utils/common';

import { DEBOUNCE_DELAY } from './useSearchCustomTokens.constants';

export function useSearchCustomTokens(): UseSearchCustomTokens {
  const blockchains = useAppStore().blockchains();
  const abortControllerRef = useRef<AbortController | null>(null);
  const { customTokens } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = async (query: string, blockchain?: string) => {
    setError(null);
    setLoading(true);
    setTokens([]);

    try {
      const response = await httpService().searchCustomTokens(
        { query, blockchain },
        { signal: abortControllerRef.current?.signal }
      );

      const customTokensSet = new Set(
        customTokens().map((token) => createAssetKey(token))
      );
      const blockchainsSet = new Set(
        blockchains.map((blockchain) => blockchain.name)
      );
      const filteredTokens = response.tokens.filter(
        (token) =>
          blockchainsSet.has(token.blockchain) &&
          !customTokensSet.has(createAssetKey(token))
      );

      setTokens(filteredTokens);
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error instanceof Error ? error.message : 'something went wrong');
      setTokens([]);
      if (error?.name !== 'CanceledError') {
        setLoading(false);
      }
    }
  };

  const debouncedFetch = useCallback(
    debounce((query: string, blockchain?: string) => {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      void fetch(query, blockchain);
    }, DEBOUNCE_DELAY),
    [blockchains.length]
  );

  const cancel = () => {
    abortControllerRef.current?.abort();
  };
  return {
    fetch: (query: string, blockchain?: string) => {
      abortControllerRef.current = new AbortController();
      setTokens([]);
      setLoading(true);
      debouncedFetch(query, blockchain);
    },
    cancel,
    loading,
    tokens,
    error,
  };
}
