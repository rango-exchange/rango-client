import { BestRouteResponse, BlockchainMeta } from 'rango-sdk';
import { Token } from 'rango-sdk/lib';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import BigNumber from 'bignumber.js';
import { ZERO } from '../constants/numbers';
import { getBestRouteToTokenUsdPrice } from '../utils/routing';
import createSelectors from './selectors';

const getUsdValue = (token: Token | null, amount: string) =>
  new BigNumber(amount || ZERO).multipliedBy(token?.usdPrice || 0);

interface RouteState {
  fromChain: BlockchainMeta | null;
  toChain: BlockchainMeta | null;
  inputAmount: string;
  inputUsdValue: BigNumber;
  outputAmount: BigNumber | null;
  outputUsdValue: BigNumber;
  fromToken: Token | null;
  toToken: Token | null;
  setFromChain: (chain: BlockchainMeta | null) => void;
  setToChain: (chian: BlockchainMeta | null) => void;
  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
  setInputAmount: (amount: string) => void;
  bestRoute: BestRouteResponse | null;
  setBestRoute: (bestRoute: BestRouteResponse | null) => void;
}

export const useBestRouteStore = createSelectors(
  create<RouteState>()(
    immer((set) => ({
      fromChain: null,
      fromToken: null,
      inputAmount: '',
      outputAmount: null,
      inputUsdValue: new BigNumber(0),
      outputUsdValue: new BigNumber(0),
      toChain: null,
      toToken: null,
      bestRoute: null,
      setBestRoute: (bestRoute) =>
        set((state) => {
          state.bestRoute = bestRoute;
          if (!!bestRoute) {
            const outputAmount = !!bestRoute.result?.outputAmount
              ? new BigNumber(bestRoute.result?.outputAmount)
              : null;
            state.outputAmount = outputAmount;
            state.outputUsdValue = new BigNumber(outputAmount || ZERO).multipliedBy(
              getBestRouteToTokenUsdPrice(bestRoute) || state.toToken?.usdPrice || 0,
            );
          }
        }),
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
  ),
);
