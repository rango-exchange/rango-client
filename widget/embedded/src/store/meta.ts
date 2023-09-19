import type { TokenWithBalance } from '../components/TokenList';
import type { MetaResponse } from 'rango-sdk';

import { create } from 'zustand';

import { httpService } from '../services/httpService';
import { removeDuplicateFrom } from '../utils/common';
import { getTokensWithBalance, sortTokens } from '../utils/wallets';

import createSelectors from './selectors';
import { useWalletsStore } from './wallets';

export type LoadingStatus = 'loading' | 'success' | 'failed';

export interface MetaState {
  meta: MetaResponse & { tokens: TokenWithBalance[] };
  loadingStatus: LoadingStatus;
  fetchMeta: () => Promise<void>;
  setTokensWithBalance: () => void;
}

export const useMetaStore = createSelectors(
  create<MetaState>()((set) => ({
    meta: { blockchains: [], popularTokens: [], swappers: [], tokens: [] },
    loadingStatus: 'loading',
    setTokensWithBalance: () => {
      const connectedWallets = useWalletsStore.getState().connectedWallets;

      set((state) => ({
        ...state,
        meta: {
          ...state.meta,
          tokens: sortTokens(
            getTokensWithBalance(state.meta.tokens, connectedWallets)
          ),
        },
      }));
    },
    fetchMeta: async () => {
      try {
        const response = await httpService().getAllMetadata();
        const chainThatHasTokenInMetaResponse = removeDuplicateFrom(
          response.tokens.map((t) => t.blockchain)
        );
        const enabledChains = response.blockchains.filter(
          (chain) =>
            chain.enabled &&
            chainThatHasTokenInMetaResponse.includes(chain.name)
        );
        response.blockchains = enabledChains.sort((a, b) => a.sort - b.sort);
        set({ meta: response, loadingStatus: 'success' });
      } catch (error) {
        set({ loadingStatus: 'failed' });
      }
    },
  }))
);
