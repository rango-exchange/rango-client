import { create } from 'zustand';
import { MetaResponse } from 'rango-sdk';
import { httpService } from '../services/httpService';

interface MetaState {
  meta: MetaResponse;
  fetchMeta: () => Promise<void>;
}

export const useMetaStore = create<MetaState>()((set) => ({
  meta: { blockchains: [], popularTokens: [], swappers: [], tokens: [] },
  fetchMeta: async () => {
    const response = await httpService.getAllMetadata();
    set({ meta: response });
  },
}));
