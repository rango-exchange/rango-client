import { BlockchainMeta } from 'rango-sdk';
import { Token } from 'rango-sdk/lib';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface RouteState {
  fromChain: BlockchainMeta | null;
  toChain: BlockchainMeta | null;
  fromToken: Token | null;
  toToken: Token | null;
  setFromChain: (chain: BlockchainMeta) => void;
  setToChain: (chian: BlockchainMeta) => void;
  setFromToken: (token: Token) => void;
  setToToken: (token: Token) => void;
}

export const useRouteStore = create<RouteState>()(
  immer((set) => ({
    fromChain: null,
    fromToken: null,
    toChain: null,
    toToken: null,
    setFromChain: (chain) =>
      set((state) => {
        state.fromChain = chain;
      }),
    setFromToken: (token) =>
      set((state) => {
        state.fromToken = token;
      }),
    setToChain: (chain) =>
      set((state) => {
        state.toChain = chain;
      }),
    setToToken: (token) =>
      set((state) => {
        state.toToken = token;
      }),
  })),
);
