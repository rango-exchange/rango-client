import { BlockchainMeta } from 'rango-sdk';
import { Token } from 'rango-sdk/lib';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type WalletBalance = {
  chain: string;
  symbol: string;
  ticker: string;
  address: string | null;
  rawAmount: string;
  decimal: number | null;
  amount: string;
  logo: string | null;
  usdPrice: number | null;
};

interface RouteState {
  fromChain: BlockchainMeta | null;
  toChain: BlockchainMeta | null;
  fromToken: Token | null;
  toToken: Token | null;
  availableBalance: WalletBalance | null;
  setFromChain: (chain: BlockchainMeta) => void;
  setToChain: (chian: BlockchainMeta) => void;
  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
}

export const useBestRouteStore = create<RouteState>()(
  immer((set) => ({
    fromChain: null,
    fromToken: null,
    toChain: null,
    toToken: null,
    availableBalance: null,
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
