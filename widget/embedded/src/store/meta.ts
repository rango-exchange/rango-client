import { create } from 'zustand';
import { MetaResponse } from 'rango-sdk';
import { httpService } from '../services/httpService';
import createSelectors from './selectors';
import { removeDuplicateFrom } from '../utils/common';
import { normalizeMetaData } from '@rango-dev/wallets-shared';
import { ProviderMeta } from 'rango-types';

export type LoadingStatus = 'loading' | 'success' | 'failed';

type UpdatedMetaResponse = {
  [K in keyof MetaResponse]: K extends 'blockchains' ? ProviderMeta[] : MetaResponse[K];
};

export interface MetaState {
  meta: UpdatedMetaResponse;
  loadingStatus: LoadingStatus;
  fetchMeta: () => Promise<void>;
}

export const useMetaStore = createSelectors(
  create<MetaState>()((set) => ({
    meta: { blockchains: [], popularTokens: [], swappers: [], tokens: [] },
    loadingStatus: 'loading',
    fetchMeta: async () => {
      try {
        const response = await httpService().getAllMetadata();
        const chainThatHasTokenInMetaResponse = removeDuplicateFrom(
          response.tokens.map((t) => t.blockchain),
        );

        (response.blockchains as ProviderMeta[]) = normalizeMetaData(response.blockchains);
        const enabledChains = response.blockchains.filter(
          (chain) => chain.enabled && chainThatHasTokenInMetaResponse.includes(chain.name),
        );
        response.blockchains = enabledChains.sort((a, b) => a.sort - b.sort);
        set({
          meta: { ...response, blockchains: response.blockchains as ProviderMeta[] },
          loadingStatus: 'success',
        });
      } catch (error) {
        set({ loadingStatus: 'failed' });
      }
    },
  })),
);
