import { BestRouteResponse } from 'rango-sdk';
import { Token } from 'rango-sdk';
import { create } from 'zustand';
import BigNumber from 'bignumber.js';
import { ZERO } from '../constants/numbers';
import { getBestRouteToTokenUsdPrice, isRouteParametersChanged } from '../utils/routing';
import createSelectors from './selectors';
import { subscribeWithSelector } from 'zustand/middleware';
import { httpService } from '../services/httpService';
import { useSettingsStore } from './settings';
import { calcOutputUsdValue, createBestRouteRequestBody } from '../utils/swap';
import { useMetaStore } from './meta';
import { getDefaultToken, getSortedTokens, tokensAreEqual } from '../utils/wallets';
import { useWalletsStore } from './wallets';
import { TokenWithBalance } from '../pages/SelectTokenPage';
import { PendingSwap } from '@rango-dev/queue-manager-rango-preset/dist/shared';
import { debounce } from '../utils/common';
import { isPositiveNumber } from '../utils/numbers';
import { ProviderMeta } from 'rango-types';

const getUsdValue = (token: Token | null, amount: string) =>
  new BigNumber(amount || ZERO).multipliedBy(token?.usdPrice || 0);

export interface RouteState {
  fromChain: ProviderMeta | null;
  toChain: ProviderMeta | null;
  inputAmount: string;
  inputUsdValue: BigNumber;
  outputAmount: BigNumber | null;
  outputUsdValue: BigNumber;
  fromToken: TokenWithBalance | null;
  toToken: TokenWithBalance | null;
  loading: boolean;
  error: string;
  sourceTokens: Token[];
  destinationTokens: Token[];
  resetRoute: () => void;
  setFromChain: (chain: ProviderMeta | null, setDefaultToken?: boolean) => void;
  setToChain: (chian: ProviderMeta | null, setDefaultToken?: boolean) => void;
  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
  setInputAmount: (amount: string) => void;
  bestRoute: BestRouteResponse | null;
  setBestRoute: (bestRoute: BestRouteResponse | null) => void;
  retry: (pendingSwap: PendingSwap) => void;
  switchFromAndTo: () => void;
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
      sourceTokens: [],
      destinationTokens: [],
      setBestRoute: (bestRoute) =>
        set((state) => {
          let outputAmount: BigNumber | null = null;
          let outputUsdValue: BigNumber = ZERO;
          if (!isPositiveNumber(state.inputAmount)) return {};
          if (bestRoute) {
            outputAmount = bestRoute.result?.outputAmount
              ? new BigNumber(bestRoute.result?.outputAmount)
              : null;
            outputUsdValue = calcOutputUsdValue(
              bestRoute.result?.outputAmount,
              getBestRouteToTokenUsdPrice(bestRoute) || state.toToken?.usdPrice,
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
      resetRoute: () =>
        set(() => ({
          loading: true,
          error: '',
          bestRoute: null,
          outputAmount: null,
          outputUsdValue: new BigNumber(0),
        })),
      setFromChain: (chain, setDefaultToken) => {
        set((state) => {
          if (state.fromChain?.name === chain?.name) return {};
          const tokens = useMetaStore.getState().meta.tokens;
          const connectedWallets = useWalletsStore.getState().connectedWallets;
          const sortedTokens = getSortedTokens(
            chain,
            tokens,
            connectedWallets,
            state.destinationTokens,
          );
          const fromToken = getDefaultToken(sortedTokens, state.toToken);
          return {
            fromChain: chain,
            sourceTokens: sortedTokens,
            ...(setDefaultToken && {
              fromToken,
            }),
            ...(!!state.inputAmount && {
              inputUsdValue: getUsdValue(fromToken, state.inputAmount),
            }),
          };
        });
      },
      setFromToken: (token) =>
        set((state) => ({
          fromToken: token,
          ...(!!state.inputAmount && {
            inputUsdValue: getUsdValue(token, state.inputAmount),
          }),
        })),
      setToChain: (chain, setDefaultToken) => {
        set((state) => {
          if (state.toChain?.name === chain?.name) return {};
          const tokens = useMetaStore.getState().meta.tokens;
          const connectedWallets = useWalletsStore.getState().connectedWallets;
          const sortedTokens = getSortedTokens(
            chain,
            tokens,
            connectedWallets,
            state.destinationTokens,
          );

          return {
            toChain: chain,
            destinationTokens: sortedTokens,
            ...(setDefaultToken && {
              toToken: getDefaultToken(sortedTokens, state.fromToken),
            }),
          };
        });
      },
      setToToken: (token) =>
        set(() => ({
          toToken: token,
        })),
      setInputAmount: (amount) => {
        set((state) => ({
          inputAmount: amount,
          ...(!amount && {
            outputAmount: new BigNumber(0),
            outputUsdValue: new BigNumber(0),
            bestRoute: null,
            error: '',
          }),
          ...(!!state.fromToken && {
            inputUsdValue: getUsdValue(state.fromToken, amount),
          }),
        }));
      },
      retry: (pendingSwap) => {
        const { tokens, blockchains } = useMetaStore.getState().meta;
        const connectedWallets = useWalletsStore.getState().connectedWallets;
        const failedIndex =
          pendingSwap.status === 'failed'
            ? pendingSwap.steps.findIndex((s) => s.status === 'failed')
            : null;

        if (failedIndex === null || failedIndex < 0) return;

        const firstStep = pendingSwap.steps[0];
        const lastStep = pendingSwap.steps[pendingSwap.steps.length - 1];
        const fromChain =
          blockchains.find((blockchain) => blockchain.name === firstStep.fromBlockchain) || null;
        const toChain =
          blockchains.find((blockchain) => blockchain.name === lastStep.toBlockchain) || null;

        const fromToken = tokens.find((token) =>
          tokensAreEqual(token, {
            blockchain: firstStep.fromBlockchain,
            symbol: firstStep.fromSymbol,
            address: firstStep.fromSymbolAddress,
          }),
        );

        const toToken = tokens.find((token) =>
          tokensAreEqual(token, {
            blockchain: lastStep.toBlockchain,
            symbol: lastStep.toSymbol,
            address: lastStep.toSymbolAddress,
          }),
        );
        const sortedSourceTokens = getSortedTokens(fromChain, tokens, connectedWallets, []);
        const sortedDestinationTokens = getSortedTokens(toChain, tokens, connectedWallets, []);
        const inputAmount = pendingSwap.inputAmount;
        set({
          fromChain,
          fromToken,
          inputAmount,
          outputAmount: null,
          inputUsdValue: getUsdValue(fromToken || null, inputAmount),
          outputUsdValue: new BigNumber(0),
          toChain,
          toToken,
          bestRoute: null,
          loading: false,
          error: '',
          sourceTokens: sortedSourceTokens,
          destinationTokens: sortedDestinationTokens,
        });
      },
      switchFromAndTo: () =>
        set((state) => ({
          fromChain: state.toChain,
          fromToken: state.toToken,
          toChain: state.fromChain,
          toToken: state.fromToken,
          sourceTokens: state.destinationTokens,
          destinationTokens: state.sourceTokens,
          inputAmount: state.outputAmount?.toString() || '',
          inputUsdValue: getUsdValue(state.toToken, state.outputAmount?.toString() || ''),
        })),
    })),
  ),
);

const bestRoute = (
  bestRouteStore: typeof useBestRouteStore,
  settingsStore: typeof useSettingsStore,
) => {
  let abortController: AbortController | null = null;
  const fetchBestRoute = () => {
    const { fromToken, toToken, inputAmount, resetRoute } = bestRouteStore.getState();
    const { slippage, customSlippage, disabledLiquiditySources, affiliateRef } =
      settingsStore.getState();
    if (!fromToken || !toToken || !isPositiveNumber(inputAmount)) return;
    abortController?.abort();
    abortController = new AbortController();
    const userSlippage = customSlippage ? customSlippage : slippage;
    const requestBody = createBestRouteRequestBody(
      fromToken,
      toToken,
      inputAmount,
      [],
      [],
      disabledLiquiditySources,
      userSlippage,
      affiliateRef,
    );

    if (!bestRouteStore.getState().loading) {
      resetRoute();
    }
    httpService()
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

  const debouncedFetchBestRoute = debounce(fetchBestRoute, 600);

  const bestRouteParamsListener = () => {
    const { fromToken, toToken, inputAmount, inputUsdValue, resetRoute } =
      useBestRouteStore.getState();
    if (!isPositiveNumber(inputAmount) || inputUsdValue.eq(0))
      return bestRouteStore.setState({ loading: false });

    if (tokensAreEqual(fromToken, toToken))
      return bestRouteStore.setState({
        loading: false,
        bestRoute: null,
        outputAmount: new BigNumber(inputAmount),
        outputUsdValue: inputUsdValue,
      });

    if (!bestRouteStore.getState().loading) resetRoute();
    debouncedFetchBestRoute();
  };

  useBestRouteStore.subscribe(
    (state) => ({
      fromChain: state.fromChain,
      fromToken: state.fromToken,
      toChain: state.toChain,
      toToken: state.toToken,
      inputAmount: state.inputAmount,
    }),
    bestRouteParamsListener,
    {
      equalityFn: (prevState, currentState) => {
        if (
          isRouteParametersChanged({
            store: 'bestRoute',
            prevState,
            currentState,
          })
        )
          return false;
        else return true;
      },
    },
  );

  useSettingsStore.subscribe(
    (state) => ({
      slippage: state.slippage,
      customSlippage: state.customSlippage,
      disabledLiquiditySources: state.disabledLiquiditySources,
      infiniteApprove: state.infiniteApprove,
    }),
    bestRouteParamsListener,
    {
      equalityFn: (prevState, currentState) => {
        if (
          isRouteParametersChanged({
            store: 'settings',
            prevState,
            currentState,
          })
        )
          return false;
        else return true;
      },
    },
  );

  return { fetchBestRoute };
};

export const { fetchBestRoute } = bestRoute(useBestRouteStore, useSettingsStore);
