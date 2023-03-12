import { BestRouteRequest, BestRouteResponse, BlockchainMeta } from 'rango-sdk';
import { Token } from 'rango-sdk/lib';
import { create } from 'zustand';
import BigNumber from 'bignumber.js';
import { ZERO } from '../constants/numbers';
import { getBestRouteToTokenUsdPrice } from '../utils/routing';
import createSelectors from './selectors';
import { subscribeWithSelector } from 'zustand/middleware';
import { httpService } from '../services/httpService';
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

let abortController: AbortController | null = null;

export const fetchBestRoute = () => {
  useBestRouteStore.subscribe(
    (state) => ({
      fromChain: state.fromChain,
      fromToken: state.fromToken,
      toChain: state.toChain,
      toToken: state.toToken,
      inputAmount: state.inputAmount,
    }),
    (state) => {
      if (abortController) abortController.abort();
      abortController = new AbortController();
      if (!!state.fromToken && !!state.toToken && !!state.inputAmount) {
        const { slippage, customSlippage, disabledLiquiditySources } =
          useSettingsStore.getState();
        const userSlippage = customSlippage || slippage;
        const requestBody: BestRouteRequest = {
          amount: state.inputAmount?.toString(),
          connectedWallets: [],
          selectedWallets: {},
          checkPrerequisites: false,
          swapperGroups: disabledLiquiditySources,
          swappersGroupsExclude: true,
          from: {
            address: state.fromToken.address,
            blockchain: state.fromToken.blockchain,
            symbol: state.fromToken.symbol,
          },
          to: {
            address: state.toToken.address,
            blockchain: state.toToken.blockchain,
            symbol: state.toToken.symbol,
          },
        };
        useBestRouteStore.setState({ loading: true });
        httpService
          .getBestRoute(requestBody, {
            signal: abortController.signal,
          })
          .then((res) => {
            useBestRouteStore.setState({ bestRoute: res, loading: false });
            abortController = null;
          })
          .catch((error) => {
            if (error.code === 'ERR_CANCELED') return;
            useBestRouteStore.setState({
              error: error.message,
              loading: false,
            });
          });
      }
    },
    {
      fireImmediately: true,
      equalityFn: (a, b) => {
        if (
          a.fromChain?.name !== b.fromChain?.name ||
          a.toChain?.name !== b.toChain?.name ||
          a.inputAmount !== b.inputAmount ||
          a.fromToken?.symbol !== b.fromToken?.symbol ||
          a.toToken?.symbol !== b.toToken?.symbol ||
          a.fromToken?.blockchain !== b.fromToken?.blockchain ||
          a.toToken?.blockchain !== b.toToken?.blockchain ||
          a.fromToken?.address !== b.fromToken?.address ||
          a.toToken?.address !== b.toToken?.address
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
    (state) => {
      const { fromToken, toToken, inputAmount } = useBestRouteStore.getState();
      if (abortController) abortController.abort();
      abortController = new AbortController();
      if (!!fromToken && !!toToken && !!inputAmount) {
        const useSlippage = state.customSlippage || state.slippage;
        const requestBody: BestRouteRequest = {
          amount: inputAmount?.toString(),
          connectedWallets: [],
          selectedWallets: {},
          checkPrerequisites: false,
          swapperGroups: state.disabledLiquiditySources,
          swappersGroupsExclude: true,
          from: {
            address: fromToken.address,
            blockchain: fromToken.blockchain,
            symbol: fromToken.symbol,
          },
          to: {
            address: toToken.address,
            blockchain: toToken.blockchain,
            symbol: toToken.symbol,
          },
        };
        useBestRouteStore.setState({ loading: true });
        httpService
          .getBestRoute(requestBody, {
            signal: abortController.signal,
          })
          .then((res) => {
            useBestRouteStore.setState({ bestRoute: res, loading: false });
            abortController = null;
          })
          .catch((error) => {
            if (error.code === 'ERR_CANCELED') return;
            useBestRouteStore.setState({
              error: error.message,
              loading: false,
            });
          });
      }
    },
    {
      fireImmediately: true,
      equalityFn: (a, b) => {
        if (
          a.slippage !== b.slippage ||
          a.customSlippage !== b.customSlippage ||
          a.disabledLiquiditySources.length !==
            b.disabledLiquiditySources.length
        )
          return false;
        else return true;
      },
    }
  );
};
