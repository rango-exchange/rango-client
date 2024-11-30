import type {
  BlockchainMeta,
  MetaResponse,
  MultiRouteResponse,
  PreferenceType,
  Token,
} from 'rango-sdk';

import BigNumber from 'bignumber.js';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { ZERO } from '../constants/numbers';
import { eventEmitter } from '../services/eventEmitter';
import {
  type QuoteError,
  QuoteEventTypes,
  type QuoteWarning,
  type SelectedQuote,
  type Wallet,
  WidgetEvents,
} from '../types';
import { isPositiveNumber } from '../utils/numbers';
import { getUsdInputFrom, getUsdOutputFrom } from '../utils/swap';

import createSelectors from './selectors';

export const getUsdValue = (
  token: Token | null,
  amount: string
): BigNumber | null =>
  token?.usdPrice
    ? new BigNumber(amount || ZERO).multipliedBy(token?.usdPrice || 0)
    : null;

export type Meta = Pick<MetaResponse, 'blockchains' | 'tokens'>;

export type SetTokenParams = { token: Token; meta: Meta } | { token: null };

type SomeQuoteState = {
  quotes: MultiRouteResponse | null;
  sortStrategy: PreferenceType;
  refetchQuote: boolean;
  error: QuoteError | null;
  warning: QuoteWarning | null;
};
export type RetryQuote = {
  fromBlockchain: BlockchainMeta | null;
  fromToken?: Token;
  toBlockchain: BlockchainMeta | null;
  toToken?: Token;
  inputAmount: string;
};
export interface QuoteState {
  fromBlockchain: BlockchainMeta | null;
  toBlockchain: BlockchainMeta | null;
  inputAmount: string;
  inputUsdValue: BigNumber | null;
  outputAmount: BigNumber | null;
  outputUsdValue: BigNumber | null;
  fromToken: Token | null;
  sortStrategy: PreferenceType;
  toToken: Token | null;
  quoteWalletsConfirmed: boolean;
  selectedWallets: Wallet[];
  quoteWarningsConfirmed: boolean;
  refetchQuote: boolean;
  selectedQuote: SelectedQuote | null;
  quotes: MultiRouteResponse | null;
  customDestination: string | null;
  error: QuoteError | null;
  warning: QuoteWarning | null;
  resetQuote: () => void;
  resetAlerts: () => void;

  resetToBlockchain: () => void;
  resetFromBlockchain: () => void;
  setFromBlockchain: (chain: BlockchainMeta | null) => void;
  setToBlockchain: (chian: BlockchainMeta | null) => void;
  setFromToken: (params: SetTokenParams) => void;
  setToToken: (params: SetTokenParams) => void;
  updateQuotePartialState: <K extends keyof SomeQuoteState>(
    key: K,
    value: SomeQuoteState[K]
  ) => void;
  setInputAmount: (amount: string) => void;
  setSelectedQuote: (quote: SelectedQuote | null) => void;
  retry: (retryQuote: RetryQuote) => void;
  switchFromAndTo: () => void;
  setQuoteWalletConfirmed: (flag: boolean) => void;
  setSelectedWallets: (wallets: Wallet[]) => void;
  setCustomDestination: (address: string | null) => void;
  resetQuoteWallets: () => void;
  setQuoteWarningsConfirmed: (flag: boolean) => void;
}

export const useQuoteStore = createSelectors(
  create<QuoteState>()(
    subscribeWithSelector((set) => ({
      fromBlockchain: null,
      fromToken: null,
      inputAmount: '',
      outputAmount: null,
      inputUsdValue: new BigNumber(0),
      outputUsdValue: new BigNumber(0),
      toBlockchain: null,
      toToken: null,
      refetchQuote: true,
      sortStrategy: 'SMART',
      selectedQuote: null,
      quotes: null,
      error: null,
      warning: null,
      quoteWalletsConfirmed: false,
      selectedWallets: [],
      customDestination: null,
      quoteWarningsConfirmed: false,
      updateQuotePartialState: (key, value) =>
        set((state) => ({
          ...state,
          [key]: value,
        })),
      setSelectedQuote: (quote) =>
        set((state) => {
          let outputAmount: BigNumber | null = null;
          let outputUsdValue: BigNumber = ZERO;

          let inputUsdValue = state.inputUsdValue;
          if (!isPositiveNumber(state.inputAmount)) {
            return {};
          }
          if (!!quote) {
            outputAmount = !!quote?.outputAmount
              ? new BigNumber(quote?.outputAmount)
              : null;
            inputUsdValue = getUsdInputFrom(quote) ?? ZERO;
            outputUsdValue = getUsdOutputFrom(quote) ?? ZERO;
          }
          return {
            selectedQuote: quote,
            ...(!!quote && {
              outputAmount,
              outputUsdValue,
              inputUsdValue,
            }),
          };
        }),
      resetAlerts: () =>
        set(() => ({
          error: null,
          warning: null,
        })),
      resetQuote: () =>
        set(() => ({
          selectedQuote: null,
          outputAmount: null,
          outputUsdValue: new BigNumber(0),
          quotes: null,
          refetchQuote: true,
          error: null,
          warning: null,
        })),
      setFromBlockchain: (chain) => {
        set((state) => {
          if (state.fromBlockchain?.name === chain?.name) {
            return {};
          }

          return {
            fromBlockchain: chain,
            inputUsdValue: new BigNumber(0),
            ...(state.fromToken && {
              selectedQuote: null,
              fromToken: null,
              outputAmount: null,
              outputUsdValue: new BigNumber(0),
            }),
          };
        });
      },
      setFromToken: (params) => {
        return set((state) => ({
          fromToken: params.token,
          ...(params.token && {
            fromBlockchain:
              params.meta.blockchains.find(
                (blockchain) => blockchain.name === params.token.blockchain
              ) ?? null,
          }),
          ...(!!state.inputAmount && {
            inputUsdValue: getUsdValue(params.token, state.inputAmount),
          }),
        }));
      },
      setToBlockchain: (chain) => {
        set((state) => {
          if (state.toBlockchain?.name === chain?.name) {
            return {};
          }

          return {
            toBlockchain: chain,
            ...(state.toToken && {
              selectedQuote: null,
              toToken: null,
              outputAmount: null,
              outputUsdValue: new BigNumber(0),
            }),
          };
        });
      },
      setToToken: (params) => {
        return set(() => ({
          toToken: params.token,
          ...(params.token && {
            toBlockchain:
              params.meta.blockchains.find(
                (blockchain) => blockchain.name === params.token.blockchain
              ) ?? null,
          }),
        }));
      },
      setInputAmount: (amount) => {
        set((state) => ({
          inputAmount: amount,
          ...(!amount && {
            outputAmount: null,
            outputUsdValue: new BigNumber(0),
            selectedQuote: null,
          }),
          ...(!!state.fromToken && {
            inputUsdValue: getUsdValue(state.fromToken, amount),
          }),
        }));
      },
      retry: (retryQuote) => {
        const {
          fromBlockchain,
          fromToken,
          toBlockchain,
          toToken,
          inputAmount,
        } = retryQuote;

        set({
          fromBlockchain,
          fromToken,
          inputAmount,
          outputAmount: null,
          inputUsdValue: getUsdValue(fromToken ?? null, inputAmount),
          outputUsdValue: new BigNumber(0),
          toBlockchain,
          toToken,
          selectedQuote: null,
        });
      },
      switchFromAndTo: () =>
        set((state) => ({
          fromBlockchain: state.toBlockchain,
          fromToken: state.toToken,
          toBlockchain: state.fromBlockchain,
          toToken: state.fromToken,
          inputAmount: state.outputAmount?.toString() || '',
          inputUsdValue: state.toToken
            ? getUsdValue(state.toToken, state.outputAmount?.toString() || '')
            : new BigNumber(0),
        })),
      resetFromBlockchain: () =>
        set(() => ({
          fromToken: null,
          fromBlockchain: null,
          outputUsdValue: new BigNumber(0),
          inputUsdValue: new BigNumber(0),
          inputAmount: '',
          outputAmount: null,
          selectedQuote: null,
        })),
      resetToBlockchain: () =>
        set(() => ({
          toToken: null,
          toBlockchain: null,
          outputAmount: null,
          outputUsdValue: new BigNumber(0),
          selectedQuote: null,
        })),
      setQuoteWalletConfirmed: (flag) =>
        set({
          quoteWalletsConfirmed: flag,
        }),
      setSelectedWallets: (wallets) => set({ selectedWallets: wallets }),
      setCustomDestination: (address) => set({ customDestination: address }),
      resetQuoteWallets: () =>
        set({
          quoteWalletsConfirmed: false,
          selectedWallets: [],
          customDestination: null,
        }),
      setQuoteWarningsConfirmed: (flag) =>
        set({ quoteWarningsConfirmed: flag }),
    }))
  )
);

export const unsubscribeQuoteStore = useQuoteStore.subscribe(
  (selectedState, previousSelectedState) => {
    if (
      selectedState.fromBlockchain !== previousSelectedState.fromBlockchain ||
      selectedState.fromToken !== previousSelectedState.fromToken ||
      selectedState.toBlockchain !== previousSelectedState.toBlockchain ||
      selectedState.toToken !== previousSelectedState.toToken ||
      selectedState.inputAmount !== previousSelectedState.inputAmount
    ) {
      // useEffect hook can not be used in Zustand subscribe
      eventEmitter.emit(WidgetEvents.QuoteEvent, {
        type: QuoteEventTypes.QUOTE_INPUT_UPDATE,
        payload: {
          fromBlockchain: selectedState.fromBlockchain?.name,
          toBlockchain: selectedState.toBlockchain?.name,
          fromToken: selectedState.fromToken
            ? {
                symbol: selectedState.fromToken.symbol,
                name: selectedState.fromToken.name,
                address: selectedState.fromToken.address,
              }
            : undefined,
          toToken: selectedState.toToken
            ? {
                symbol: selectedState.toToken.symbol,
                name: selectedState.toToken.name,
                address: selectedState.toToken.address,
              }
            : undefined,
          requestAmount: selectedState.inputAmount,
        },
      });
    }

    if (
      selectedState.selectedQuote?.requestId !==
      previousSelectedState.selectedQuote?.requestId
    ) {
      eventEmitter.emit(WidgetEvents.QuoteEvent, {
        type: QuoteEventTypes.QUOTE_OUTPUT_UPDATE,
        payload: selectedState.selectedQuote
          ? {
              requestAmount: selectedState.selectedQuote.requestAmount,
              swaps: selectedState.selectedQuote.swaps,
              outputAmount: selectedState.selectedQuote.outputAmount,
              resultType: selectedState.selectedQuote.resultType,
              tags: selectedState.selectedQuote.tags,
            }
          : null,
      });
    }
  }
);
