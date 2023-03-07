import { BestRouteResponse, BlockchainMeta } from 'rango-sdk';
import { Token } from 'rango-sdk/lib';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import BigNumber from 'bignumber.js';
import { ZERO } from '../constants/numbers';
import { getBestRouteToTokenUsdPrice } from '../utils/routing';
import createSelectors from './selectors';
import { subscribeWithSelector } from 'zustand/middleware';
import { useSettingsStore } from './settings';

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
  loading: boolean;
  error: string;
  setFromChain: (chain: BlockchainMeta | null) => void;
  setToChain: (chian: BlockchainMeta | null) => void;
  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
  setInputAmount: (amount: string) => void;
  bestRoute: BestRouteResponse | null;
  setBestRoute: (bestRoute: BestRouteResponse | null) => void;
  fetchBestRoute: () => void;
}

export const useBestRouteStore = createSelectors(
  create<RouteState>()(
    subscribeWithSelector((set, get, api) => ({
      fromChain: null,
      fromToken: null,
      inputAmount: '',
      outputAmount: null,
      inputUsdValue: new BigNumber(0),
      outputUsdValue: new BigNumber(0),
      toChain: null,
      toToken: null,
      bestRoute: null,
      loading: false,
      error: '',
      fetchBestRoute: () => {},
      setBestRoute: (bestRoute) =>
        set((state) => {
          let outputAmount: BigNumber | null = null;
          let outputUsdValue: BigNumber = ZERO;
          if (!!bestRoute) {
            outputAmount = !!bestRoute.result?.outputAmount
              ? new BigNumber(bestRoute.result?.outputAmount)
              : null;
            outputUsdValue = new BigNumber(outputAmount || ZERO).multipliedBy(
              getBestRouteToTokenUsdPrice(bestRoute) || state.toToken?.usdPrice || 0,
            );
          }
          return {
            bestRoute: bestRoute,
            ...(!!bestRoute && {
              outputAmount: outputAmount,
              outputUsdValue: outputUsdValue,
            }),
          };
        }),
      setFromChain: (chain) =>
        set(() => ({
          fromChain: chain,
        })),
      setFromToken: (token) =>
        set((state) => ({
          fromToken: token,
          ...(!!state.inputAmount && {
            inputUsdValue: getUsdValue(state.fromToken!, state.inputAmount),
          }),
        })),
      setToChain: (chain) =>
        set(() => ({
          toChain: chain,
        })),
      setToToken: (token) =>
        set(() => ({
          toToken: token,
        })),
      setInputAmount: (amount) =>
        set((state) => ({
          inputAmount: amount,
          ...(!!state.fromToken && {
            inputUsdValue: getUsdValue(state.fromToken, state.inputAmount),
          }),
        })),
    })),
  ),
);
