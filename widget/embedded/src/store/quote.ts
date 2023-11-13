import type { TokenWithBalance } from '../components/TokenList';
import type { Wallet } from '../types';
import type { PendingSwap } from '@rango-dev/queue-manager-rango-preset/dist/shared';
import type { BestRouteResponse, BlockchainMeta, Token } from 'rango-sdk';

import BigNumber from 'bignumber.js';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { ZERO } from '../constants/numbers';
import { isPositiveNumber } from '../utils/numbers';
import { createRetryQuote, getQuoteToTokenUsdPrice } from '../utils/quote';
import { calcOutputUsdValue } from '../utils/swap';

import { useMetaStore } from './meta';
import createSelectors from './selectors';

export const getUsdValue = (
  token: Token | null,
  amount: string
): BigNumber | null =>
  token?.usdPrice
    ? new BigNumber(amount || ZERO).multipliedBy(token?.usdPrice || 0)
    : null;

export interface QuoteState {
  fromBlockchain: BlockchainMeta | null;
  toBlockchain: BlockchainMeta | null;
  inputAmount: string;
  inputUsdValue: BigNumber | null;
  outputAmount: BigNumber | null;
  outputUsdValue: BigNumber | null;
  fromToken: TokenWithBalance | null;
  toToken: TokenWithBalance | null;
  quoteWalletsConfirmed: boolean;
  selectedWallets: Wallet[];
  quoteWarningsConfirmed: boolean;
  resetQuote: () => void;
  resetToBlockchain: () => void;
  resetFromBlockchain: () => void;
  setFromBlockchain: (chain: BlockchainMeta | null) => void;
  setToBlockchain: (chian: BlockchainMeta | null) => void;

  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
  setInputAmount: (amount: string) => void;
  quote: BestRouteResponse | null;
  setQuote: (quote: BestRouteResponse | null) => void;
  retry: (pendingSwap: PendingSwap) => void;
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
      setFromToken: (token) => {
        const { blockchains } = useMetaStore.getState().meta;
        return set((state) => ({
          fromToken: token,
          ...(token && {
            fromBlockchain:
              blockchains.find(
                (blockchain) => blockchain.name === token.blockchain
              ) ?? null,
          }),
          ...(!!state.inputAmount && {
            inputUsdValue: getUsdValue(token, state.inputAmount),
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
      setToToken: (token) => {
        const { blockchains } = useMetaStore.getState().meta;
        return set(() => ({
          toToken: token,
          ...(token && {
            toBlockchain:
              blockchains.find(
                (blockchain) => blockchain.name === token.blockchain
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
      retry: (pendingSwap) => {
        const { tokens, blockchains } = useMetaStore.getState().meta;

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
