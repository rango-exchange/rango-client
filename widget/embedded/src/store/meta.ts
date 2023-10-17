import type { TokenWithBalance } from '../components/TokenList';
import type { MetaResponse } from 'rango-sdk';

import { create } from 'zustand';

import { useAppStore } from './app';
import createSelectors from './selectors';

export type LoadingStatus = 'loading' | 'success' | 'failed';

export interface MetaState {
  meta: MetaResponse & { tokens: TokenWithBalance[] };
  loadingStatus: LoadingStatus;
  fetchMeta: () => Promise<void>;
}

export const useMetaStore = createSelectors(
  create<MetaState>()((set) => ({
    meta: { blockchains: [], popularTokens: [], swappers: [], tokens: [] },
    loadingStatus: 'loading',
    fetchMeta: async () => {
      try {
        await useAppStore.getState().fetch();

        const state = useAppStore.getState();
        const response: MetaResponse = {
          blockchains: state.blockchains(),
          tokens: state.tokens(),
          popularTokens: state._popularTokens,
          swappers: state._swappers,
        };

        set({ meta: response, loadingStatus: 'success' });
      } catch (error) {
        set({ loadingStatus: 'failed' });
      }
    },
  }))
);
