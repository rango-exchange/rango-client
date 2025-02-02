import type { MetaResponse } from 'rango-sdk';

import { create } from 'zustand';

import { rango } from '../services/httpService';

import createSelectors from './selectors';

export type LoadingStatus = 'loading' | 'success' | 'failed';

interface MetaState {
  meta: MetaResponse;
  loadingStatus: LoadingStatus;
  fetchMeta: () => Promise<void>;
}

export const useMetaStore = createSelectors(
  create<MetaState>()((set) => ({
    meta: { blockchains: [], popularTokens: [], swappers: [], tokens: [] },
    loadingStatus: 'loading',
    fetchMeta: async () => {
      try {
        const response = await rango().getAllMetadata();
        const chainThatHasTokenInMetaResponse = Array.from(
          new Set(response.tokens.map((t) => t.blockchain))
        );
        const enabledChains = response.blockchains.filter(
          (chain) =>
            chain.enabled &&
            chainThatHasTokenInMetaResponse.includes(chain.name)
        );
        const enabledSwappers = response.swappers.filter(
          (swapper) => swapper.enabled
        );
        response.blockchains = enabledChains.sort((a, b) => a.sort - b.sort);
        response.swappers = enabledSwappers;
        set({ meta: response, loadingStatus: 'success' });
      } catch (error) {
        set({ loadingStatus: 'failed' });
      }
    },
  }))
);
