import { BestRouteResponse, BlockchainMeta } from 'rango-sdk';
import { Token } from 'rango-sdk/lib';
import { create } from 'zustand';
import BigNumber from 'bignumber.js';
import { ZERO } from '../constants/numbers';
import { getBestRouteToTokenUsdPrice } from '../utils/routing';
import createSelectors from './selectors';
import { subscribeWithSelector } from 'zustand/middleware';
import { httpService } from '../services/httpService';
import { useSettingsStore } from './settings';
import { createBestRouteRequestBody } from '../utils/swap';

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
}

export const useBestRouteStore = createSelectors(
  create<RouteState>()(
    subscribeWithSelector((set) => ({
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
      setBestRoute: (bestRoute) =>
        set((state) => {
          let outputAmount: BigNumber | null = null;
          let outputUsdValue: BigNumber = ZERO;
          if (!!bestRoute) {
            outputAmount = !!bestRoute.result?.outputAmount
              ? new BigNumber(bestRoute.result?.outputAmount)
              : null;
            outputUsdValue = new BigNumber(outputAmount || ZERO).multipliedBy(
              getBestRouteToTokenUsdPrice(bestRoute) ||
                state.toToken?.usdPrice ||
                0
            );
          }
          return {
            bestRoute,
            ...(!!bestRoute && {
              outputAmount,
              outputUsdValue,
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
            inputUsdValue: getUsdValue(token, state.inputAmount),
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
            inputUsdValue: getUsdValue(state.fromToken, amount),
          }),
        })),
    }))
  )
);

const bestRoute = (
  bestRouteStore: typeof useBestRouteStore,
  settingsStore: typeof useSettingsStore
) => {
  let abortController: AbortController | null = null;
  const fetchBestRoute = () => {
    const { fromToken, toToken, inputAmount } = bestRouteStore.getState();
    const { slippage, customSlippage, disabledLiquiditySources } =
      settingsStore.getState();
    if (!fromToken || !toToken || !inputAmount) return;
    abortController?.abort();
    abortController = new AbortController();
    const userSlippage = customSlippage | slippage;
    const requestBody = createBestRouteRequestBody(
      fromToken,
      toToken,
      inputAmount,
      [],
      [],
      disabledLiquiditySources,
      userSlippage,
      false
    );
    bestRouteStore.setState({ loading: true, bestRoute: null });
    httpService
      .getBestRoute(requestBody, {
        signal: abortController.signal,
      })
      .then((res) => {
        const { setBestRoute } = bestRouteStore.getState();
        setBestRoute(res);
        bestRouteStore.setState({ loading: false });
        abortController = null;
      })
      .catch((error) => {
        if (error.code === 'ERR_CANCELED') return;
        bestRouteStore.setState({
          error: error.message,
          loading: false,
        });
      });
  };

  useBestRouteStore.subscribe(
    (state) => ({
      fromChain: state.fromChain,
      fromToken: state.fromToken,
      toChain: state.toChain,
      toToken: state.toToken,
      inputAmount: state.inputAmount,
    }),

    fetchBestRoute.bind(null),
    {
      equalityFn: (prevState, state) => {
        if (
          prevState.fromChain?.name !== state.fromChain?.name ||
          prevState.toChain?.name !== state.toChain?.name ||
          prevState.fromToken?.symbol !== state.fromToken?.symbol ||
          prevState.toToken?.symbol !== state.toToken?.symbol ||
          prevState.fromToken?.blockchain !== state.fromToken?.blockchain ||
          prevState.toToken?.blockchain !== state.toToken?.blockchain ||
          prevState.fromToken?.address !== state.fromToken?.address ||
          prevState.toToken?.address !== state.toToken?.address ||
          prevState.inputAmount !== state.inputAmount
        )
          return false;
        else return true;
      },
    }
  );

  useSettingsStore.subscribe(
    (state) => ({
      slippage: state.slippage,
      customSlippage: state.customSlippage,
      disabledLiquiditySources: state.disabledLiquiditySources,
    }),
    fetchBestRoute.bind(null),
    {
      equalityFn: (prevState, state) => {
        if (
          prevState.slippage !== state.slippage ||
          prevState.customSlippage !== state.customSlippage ||
          prevState.disabledLiquiditySources.length !==
            state.disabledLiquiditySources.length
        )
          return false;
        else return true;
      },
    }
  );

  return { fetchBestRoute };
};

export const { fetchBestRoute } = bestRoute(
  useBestRouteStore,
  useSettingsStore
);
