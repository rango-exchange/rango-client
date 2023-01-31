import { create } from 'zustand';
import { MetaResponse } from 'rango-sdk';
import { httpService } from '../services/httpService';

interface MetaState {
  meta: MetaResponse;
  loadingStatus: 'loading' | 'success' | 'failed';
  fetchMeta: () => Promise<void>;
}

export const useMetaStore = create<MetaState>()((set) => ({
  meta: { blockchains: [], popularTokens: [], swappers: [], tokens: [] },
  loadingStatus: 'loading',
  fetchMeta: async () => {
    try {
      const response = await httpService.getAllMetadata();
      set({ meta: response, loadingStatus: 'success' });
    } catch (error) {
      set({ loadingStatus: 'failed' });
    }
  },
}));
