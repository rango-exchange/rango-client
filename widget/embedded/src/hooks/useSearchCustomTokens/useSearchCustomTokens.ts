import type { Token } from 'rango-sdk';

import { useCallback, useRef, useState } from 'react';

import { httpService } from '../../services/httpService';
import { useAppStore } from '../../store/AppStore';
import { createAssetKey } from '../../store/utils/wallets';
import { debounce } from '../../utils/common';

import { DEBOUNCE_DELAY } from './useSearchCustomTokens.constants';

export function useSearchCustomTokens() {
  const abortController = useRef<AbortController | null>(null);
  const { customTokens } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [error, setError] = useState<string | null>();

  const fetch = async (query: string, blockchain?: string) => {
    setError(null);
    setLoading(true);
    abortController.current?.abort();
    abortController.current = new AbortController();
    setTokens([]);

    try {
      let { tokens } = await httpService().searchCustomTokens(
        { query, blockchain },
        { signal: abortController.current.signal }
      );

      const customTokensSet = new Set(
        customTokens().map((token) => createAssetKey(token))
      );
      tokens = tokens.filter(
        (token) => !customTokensSet.has(createAssetKey(token))
      );

      setTokens(tokens);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'something went wrong');
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce((query: string, blockchain?: string) => {
      if (abortController.current?.signal.aborted) {
        return;
      }
      void fetch(query, blockchain);
    }, DEBOUNCE_DELAY),
    []
  );

  const cancel = () => {
    abortController.current?.abort();
    abortController.current = null;
  };

  return {
    fetch: (query: string, blockchain?: string) => {
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
