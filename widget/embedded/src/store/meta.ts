import { create } from 'zustand';
import { MetaResponse } from 'rango-sdk';
import { httpService } from '../services/httpService';
import createSelectors from './selectors';
import { removeDuplicateFrom } from '../utils/common';

export type LoadingStatus = 'loading' | 'success' | 'failed';

export interface MetaState {
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
        const response = await httpService.getAllMetadata();
        const chainThatHasTokenInMetaResponse = removeDuplicateFrom(
          response.tokens.map((t) => t.blockchain),
        );
        const enabledChains = response.blockchains.filter(
          (chain) => chain.enabled && chainThatHasTokenInMetaResponse.includes(chain.name),
        );
        response.blockchains = enabledChains.sort((a, b) => a.sort - b.sort);
        set({ meta: response, loadingStatus: 'success' });
      } catch (error) {
        set({ loadingStatus: 'failed' });
      }
    },
  })),
);
