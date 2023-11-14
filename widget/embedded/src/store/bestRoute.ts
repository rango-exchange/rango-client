import type { TokenWithBalance } from '../components/TokenList';
import type { Wallet } from '../types';
import type { PendingSwap } from '@rango-dev/queue-manager-rango-preset/dist/shared';
import type {
  BestRouteResponse,
  BlockchainMeta,
  MetaResponse,
  Token,
} from 'rango-sdk';

import BigNumber from 'bignumber.js';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { ZERO } from '../constants/numbers';
import { isPositiveNumber } from '../utils/numbers';
import {
  createRetryRoute,
  getBestRouteToTokenUsdPrice,
} from '../utils/routing';
import { calcOutputUsdValue } from '../utils/swap';

import createSelectors from './selectors';

export type Meta = Pick<MetaResponse, 'blockchains' | 'tokens'>;

export type SetTokenParams = { token: Token; meta: Meta } | { token: null };

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

  setFromToken: (params: SetTokenParams) => void;
  setToToken: (params: SetTokenParams) => void;
  setInputAmount: (amount: string) => void;
  bestRoute: BestRouteResponse | null;
  setRoute: (bestRoute: BestRouteResponse | null) => void;
  retry: (pendingSwap: PendingSwap, meta: Meta) => void;
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
            ...(state.fromToken && {
              bestRoute: null,
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
              bestRoute: null,
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
            bestRoute: null,
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
        } = createRetryRoute(pendingSwap, blockchains, tokens);

        set({
          fromBlockchain,
          fromToken,
          inputAmount,
          outputAmount: null,
          inputUsdValue: getUsdValue(fromToken ?? null, inputAmount),
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
          fromToken: null,
          fromBlockchain: null,
          outputAmount: null,
          outputUsdValue: null,
          bestRoute: null,
        })),
      resetToBlockchain: () =>
        set(() => ({
          toToken: null,
          toBlockchain: null,
          outputAmount: null,
          outputUsdValue: null,
          bestRoute: null,
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
