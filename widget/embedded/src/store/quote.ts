import type { Wallet } from '../types';
import type {
  BestRouteResponse,
  BlockchainMeta,
  MetaResponse,
  Token,
} from 'rango-sdk';
import type { PendingSwap } from 'rango-types';

import BigNumber from 'bignumber.js';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { ZERO } from '../constants/numbers';
import { isPositiveNumber } from '../utils/numbers';
import { createRetryQuote, getQuoteToTokenUsdPrice } from '../utils/quote';
import { calcOutputUsdValue } from '../utils/swap';

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

export interface QuoteState {
  fromBlockchain: BlockchainMeta | null;
  toBlockchain: BlockchainMeta | null;
  inputAmount: string;
  inputUsdValue: BigNumber | null;
  outputAmount: BigNumber | null;
  outputUsdValue: BigNumber | null;
  fromToken: Token | null;
  toToken: Token | null;
  quoteWalletsConfirmed: boolean;
  selectedWallets: Wallet[];
  quoteWarningsConfirmed: boolean;
  resetQuote: () => void;
  resetToBlockchain: () => void;
  resetFromBlockchain: () => void;
  setFromBlockchain: (chain: BlockchainMeta | null) => void;
  setToBlockchain: (chian: BlockchainMeta | null) => void;

  setFromToken: (params: SetTokenParams) => void;
  setToToken: (params: SetTokenParams) => void;
  setInputAmount: (amount: string) => void;
  quote: BestRouteResponse | null;
  setQuote: (quote: BestRouteResponse | null) => void;
  retry: (pendingSwap: PendingSwap, meta: Meta) => void;
  switchFromAndTo: () => void;
  setQuoteWalletConfirmed: (flag: boolean) => void;
  setSelectedWallets: (wallets: Wallet[]) => void;
  customDestination: string;
  setCustomDestination: (address: string) => void;
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
      quote: null,
      quoteWalletsConfirmed: false,
      selectedWallets: [],
      customDestination: '',
      quoteWarningsConfirmed: false,
      setQuote: (quote) =>
        set((state) => {
          let outputAmount: BigNumber | null = null;
          let outputUsdValue: BigNumber = ZERO;
          if (!isPositiveNumber(state.inputAmount)) {
            return {};
          }
          if (!!quote) {
            outputAmount = !!quote.result?.outputAmount
              ? new BigNumber(quote.result?.outputAmount)
              : null;
            outputUsdValue = calcOutputUsdValue(
              quote.result?.outputAmount,
              getQuoteToTokenUsdPrice(quote) || state.toToken?.usdPrice
            );
          }
          return {
            quote: quote,
            ...(!!quote && {
              outputAmount,
              outputUsdValue,
            }),
          };
        }),
      resetQuote: () =>
        set(() => ({
          quote: null,
          outputAmount: null,
          outputUsdValue: new BigNumber(0),
        })),
      setFromBlockchain: (chain) => {
        set((state) => {
          if (state.fromBlockchain?.name === chain?.name) {
            return {};
          }

          return {
            fromBlockchain: chain,
            ...(state.fromToken && {
              quote: null,
              fromToken: null,
              outputAmount: null,
              outputUsdValue: null,
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
              quote: null,
              toToken: null,
              outputAmount: null,
              outputUsdValue: null,
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
            outputAmount: new BigNumber(0),
            outputUsdValue: new BigNumber(0),
            quote: null,
          }),
          ...(!!state.fromToken && {
            inputUsdValue: getUsdValue(state.fromToken, amount),
          }),
        }));
      },
      retry: (pendingSwap, meta) => {
        const { tokens, blockchains } = meta;
        const {
          fromBlockchain,
          fromToken,
          toBlockchain,
          toToken,
          inputAmount,
        } = createRetryQuote(pendingSwap, blockchains, tokens);
        set({
          fromBlockchain,
          fromToken,
          inputAmount,
          outputAmount: null,
          inputUsdValue: getUsdValue(fromToken ?? null, inputAmount),
          outputUsdValue: new BigNumber(0),
          toBlockchain,
          toToken,
          quote: null,
        });
      },
      switchFromAndTo: () =>
        set((state) => ({
          fromBlockchain: state.toBlockchain,
          fromToken: state.toToken,
          toBlockchain: state.fromBlockchain,
          toToken: state.fromToken,
          inputAmount: state.outputAmount?.toString() || '',
          inputUsdValue: getUsdValue(
            state.toToken,
            state.outputAmount?.toString() || ''
          ),
        })),
      resetFromBlockchain: () =>
        set(() => ({
          fromToken: null,
          fromBlockchain: null,
          outputAmount: null,
          outputUsdValue: null,
          quote: null,
        })),
      resetToBlockchain: () =>
        set(() => ({
          toToken: null,
          toBlockchain: null,
          outputAmount: null,
          outputUsdValue: null,
          quote: null,
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
          customDestination: '',
        }),
      setQuoteWarningsConfirmed: (flag) =>
        set({ quoteWarningsConfirmed: flag }),
    }))
  )
);
