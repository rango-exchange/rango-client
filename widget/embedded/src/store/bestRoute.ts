import type { TokenWithBalance } from '../components/TokenList';
import type { Wallet } from '../types';
import type { PendingSwap } from '@rango-dev/queue-manager-rango-preset/dist/shared';
import type { BestRouteResponse, BlockchainMeta, Token } from 'rango-sdk';

import BigNumber from 'bignumber.js';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { ZERO } from '../constants/numbers';
import { isPositiveNumber } from '../utils/numbers';
import { getBestRouteToTokenUsdPrice } from '../utils/routing';
import { calcOutputUsdValue } from '../utils/swap';
import { tokensAreEqual } from '../utils/wallets';

import { useMetaStore } from './meta';
import createSelectors from './selectors';

const getUsdValue = (token: Token | null, amount: string): BigNumber | null =>
  token?.usdPrice
    ? new BigNumber(amount || ZERO).multipliedBy(token?.usdPrice || 0)
    : null;

export interface RouteState {
  fromBlockchain: BlockchainMeta | null;
  toBlockchain: BlockchainMeta | null;
  inputAmount: string;
  inputUsdValue: BigNumber | null;
  outputAmount: BigNumber | null;
  outputUsdValue: BigNumber | null;
  fromToken: TokenWithBalance | null;
  toToken: TokenWithBalance | null;
  routeWalletsConfirmed: boolean;
  selectedWallets: Wallet[];
  resetRoute: () => void;
  resetToBlockchain: () => void;
  resetFromBlockchain: () => void;
  setFromBlockchain: (chain: BlockchainMeta | null) => void;
  setToBlockchain: (chian: BlockchainMeta | null) => void;

  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
  setInputAmount: (amount: string) => void;
  bestRoute: BestRouteResponse | null;
  setRoute: (bestRoute: BestRouteResponse | null) => void;
  retry: (pendingSwap: PendingSwap) => void;
  switchFromAndTo: () => void;
  setRouteWalletConfirmed: (flag: boolean) => void;
  setSelectedWallets: (wallets: Wallet[]) => void;
  customDestination: string;
  setCustomDestination: (address: string) => void;
  resetRouteWallets: () => void;
}

export const useBestRouteStore = createSelectors(
  create<RouteState>()(
    subscribeWithSelector((set) => ({
      fromBlockchain: null,
      fromToken: null,
      inputAmount: '',
      outputAmount: null,
      inputUsdValue: new BigNumber(0),
      outputUsdValue: new BigNumber(0),
      toBlockchain: null,
      toToken: null,
      bestRoute: null,
      routeWalletsConfirmed: false,
      selectedWallets: [],
      customDestination: '',
      setRoute: (bestRoute) =>
        set((state) => {
          let outputAmount: BigNumber | null = null;
          let outputUsdValue: BigNumber = ZERO;
          if (!isPositiveNumber(state.inputAmount)) {
            return {};
          }
          if (!!bestRoute) {
            outputAmount = !!bestRoute.result?.outputAmount
              ? new BigNumber(bestRoute.result?.outputAmount)
              : null;
            outputUsdValue = calcOutputUsdValue(
              bestRoute.result?.outputAmount,
              getBestRouteToTokenUsdPrice(bestRoute) || state.toToken?.usdPrice
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
          bestRoute: null,
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
      setToBlockchain: (chain) => {
        set((state) => {
          if (state.toBlockchain?.name === chain?.name) {
            return {};
          }

          return {
            toBlockchain: chain,
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
          }),
          ...(!!state.fromToken && {
            inputUsdValue: getUsdValue(state.fromToken, amount),
          }),
        }));
      },
      retry: (pendingSwap) => {
        const { tokens, blockchains } = useMetaStore.getState().meta;
        const failedIndex =
          pendingSwap.status === 'failed'
            ? pendingSwap.steps.findIndex((s) => s.status === 'failed')
            : null;

        if (failedIndex === null || failedIndex < 0) {
          return;
        }

        const firstStep = pendingSwap.steps[0];
        const lastStep = pendingSwap.steps[pendingSwap.steps.length - 1];
        const fromBlockchain =
          blockchains.find(
            (blockchain) => blockchain.name === firstStep.fromBlockchain
          ) || null;
        const toBlockchain =
          blockchains.find(
            (blockchain) => blockchain.name === lastStep.toBlockchain
          ) || null;

        const fromToken = tokens.find((token) =>
          tokensAreEqual(token, {
            blockchain: firstStep.fromBlockchain,
            symbol: firstStep.fromSymbol,
            address: firstStep.fromSymbolAddress,
          })
        );

        const toToken = tokens.find((token) =>
          tokensAreEqual(token, {
            blockchain: lastStep.toBlockchain,
            symbol: lastStep.toSymbol,
            address: lastStep.toSymbolAddress,
          })
        );

        const inputAmount = pendingSwap.inputAmount;
        set({
          fromBlockchain,
          fromToken,
          inputAmount,
          outputAmount: null,
          inputUsdValue: getUsdValue(fromToken || null, inputAmount),
          outputUsdValue: new BigNumber(0),
          toBlockchain,
          toToken,
          bestRoute: null,
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
          fromBlockchain: null,
        })),
      resetToBlockchain: () =>
        set(() => ({
          toBlockchain: null,
        })),
      setRouteWalletConfirmed: (flag) =>
        set({
          routeWalletsConfirmed: flag,
        }),
      setSelectedWallets: (wallets) => set({ selectedWallets: wallets }),
      setCustomDestination: (address) => set({ customDestination: address }),
      resetRouteWallets: () =>
        set({
          routeWalletsConfirmed: false,
          selectedWallets: [],
          customDestination: '',
        }),
    }))
  )
);
