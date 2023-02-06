import { BlockchainMeta } from 'rango-sdk';
import { Token } from 'rango-sdk/lib';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import BigNumber from 'bignumber.js';

const getUsdValue = (token: Token, amount: number | null) =>
  new BigNumber(amount || 0).multipliedBy(token.usdPrice || 0);

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
  inputAmount: number | null;
  inputUsdValue: BigNumber;
  fromToken: Token | null;
  toToken: Token | null;
  availableBalance: WalletBalance | null;
  setFromChain: (chain: BlockchainMeta | null) => void;
  setToChain: (chian: BlockchainMeta | null) => void;
  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
  setInputAmount: (amount: number | null) => void;
}

export const useBestRouteStore = create<RouteState>()(
  immer((set) => ({
    fromChain: null,
    fromToken: null,
    inputAmount: null,
    inputUsdValue: new BigNumber(0),
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
        if (!!state.inputAmount)
          state.inputUsdValue = getUsdValue(state.fromToken!, state.inputAmount);
      }),
    setToChain: (chain) =>
      set((state) => {
        state.toChain = chain;
      }),
    setToToken: (token) =>
      set((state) => {
        state.toToken = token;
      }),
    setInputAmount: (amount) =>
      set((state) => {
        state.inputAmount = amount;
        if (!!state.fromToken)
          state.inputUsdValue = getUsdValue(state.fromToken, state.inputAmount);
      }),
  })),
);
