// We keep all the received data from server in this slice

import type { ConfigSlice } from './config';
import type { BlockchainMeta, SwapperMeta, Token } from 'rango-sdk';
import type { StateCreator } from 'zustand';

import { httpService as sdk } from '../../services/httpService';
import { containsText } from '../../utils/common';
import { isTokenExcludedInConfig } from '../../utils/configs';
import { sortLiquiditySourcesByGroupTitle } from '../../utils/settings';
import { areTokensEqual } from '../../utils/wallets';

type BlockchainOptions = {
  type?: 'source' | 'destination';
};

type TokenOptions = {
  type: 'source' | 'destination';
  // filter by an specific blockchain
  blockchain?: string;
  searchFor?: string;
};
export type FetchStatus = 'loading' | 'success' | 'failed';
export interface DataSlice {
  _blockchains: BlockchainMeta[];
  _tokens: Token[];
  _popularTokens: Token[];
  _swappers: SwapperMeta[];
  fetchStatus: FetchStatus;
  blockchains: (options?: BlockchainOptions) => BlockchainMeta[];
  tokens: (options?: TokenOptions) => Token[];
  swappers: () => SwapperMeta[];
  isTokenPinned: (token: Token, type: 'source' | 'destination') => boolean;

  fetch: () => Promise<void>;
}

export const createDataSlice: StateCreator<
  DataSlice & ConfigSlice,
  [],
  [],
  DataSlice
> = (set, get) => ({
  // State
  _blockchains: [],
  _tokens: [],
  _popularTokens: [],
  _swappers: [],
  fetchStatus: 'loading',
  // Selectors
  blockchains: (options) => {
    const blockchainsFromState = get()._blockchains;

    if (!options || !options?.type) {
      return blockchainsFromState;
    }

    const config = get().config;
    const supportedBlockchainsFromConfig =
      (options.type === 'source'
        ? config.from?.blockchains
        : config.to?.blockchains) ?? [];

    const list = blockchainsFromState.filter((blockchain) => {
      if (
        supportedBlockchainsFromConfig.length > 0 &&
        !supportedBlockchainsFromConfig.includes(blockchain.name)
      ) {
        return false;
      }

      return true;
    });

    return list;
  },
  tokens: (options) => {
    const tokensFromState = get()._tokens;

    if (!options || !options?.type) {
      return tokensFromState;
    }

    const config = get().config;
    const supportedTokensConfig =
      (options.type === 'source' ? config.from?.tokens : config.to?.tokens) ??
      {};
    const blockchains = get().blockchains({
      type: options.type,
    });

    const list = tokensFromState
      .filter((token) => {
        if (
          supportedTokensConfig &&
          isTokenExcludedInConfig(token, supportedTokensConfig)
        ) {
          return false;
        }

        // If a specific blockchain has passed, we only keep that blockchain's tokens.
        if (!!options.blockchain && token.blockchain !== options.blockchain) {
          return false;
        }

        // Check only available blockchains
        if (
          !blockchains.some((blockchain) => {
            return blockchain.name === token.blockchain;
          })
        ) {
          return false;
        }

        // Search functionality
        if (options.searchFor) {
          if (
            containsText(token.symbol, options.searchFor) ||
            containsText(token.address || '', options.searchFor) ||
            containsText(token.name || '', options.searchFor)
          ) {
            return true;
          }

          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Check pinned tokens
        if (get().isTokenPinned(a, options.type)) {
          return -1;
        }
        if (get().isTokenPinned(b, options.type)) {
          return 1;
        }

        // Check secondary coins
        if (a.isSecondaryCoin) {
          return 1;
        }
        if (b.isSecondaryCoin) {
          return -1;
        }

        // Check it has an address or not.
        if (!a.address && b.address) {
          return -1;
        }
        if (a.address && !b.address) {
          return 1;
        }

        return 0;
      });

    return list;
  },
  isTokenPinned: (token, type) => {
    const pinnedTokens =
      type === 'source'
        ? get().config.from?.pinnedTokens
        : get().config.to?.pinnedTokens;
    const pinned = !!pinnedTokens?.some((pinnedToken) =>
      areTokensEqual(pinnedToken, token)
    );
    return pinned;
  },
  swappers: () => {
    const { config, campaignMode } = get();

    const campaignModeLiquiditySource = campaignMode.liquiditySources?.length
      ? campaignMode.liquiditySources
      : null;

    const liquiditySources =
      campaignModeLiquiditySource ?? config.liquiditySources;

    const enableNewLiquiditySources = campaignModeLiquiditySource
      ? false
      : config.enableNewLiquiditySources;

    /*
     * If the enableNewLiquiditySources flag is set to true, we return all swappers that are not included in the config.
     * Otherwise, we return all swappers that are included in the config.
     */
    const swappers = get()._swappers.filter((swapper) => {
      const swapperGroupIncludedInLiquiditySources = liquiditySources?.includes(
        swapper.swapperGroup
      );

      const shouldExcludeLiquiditySources =
        enableNewLiquiditySources ||
        !liquiditySources ||
        liquiditySources.length === 0;

      return shouldExcludeLiquiditySources
        ? !swapperGroupIncludedInLiquiditySources
        : swapperGroupIncludedInLiquiditySources;
    });

    const sortedSwappers = swappers.sort(sortLiquiditySourcesByGroupTitle);

    return sortedSwappers;
  },
  // Actions
  fetch: async () => {
    try {
      const response = await sdk().getAllMetadata();

      set({ fetchStatus: 'success' });
      const blockchains: BlockchainMeta[] = [];
      const tokens: Token[] = [];
      const popularTokens: Token[] = response.popularTokens;
      const swappers: SwapperMeta[] = response.swappers;

      const blockchainsWithAtLeastOneToken = new Set();

      response.tokens.forEach((token) => {
        blockchainsWithAtLeastOneToken.add(token.blockchain);

        tokens.push(token);
      });

      response.blockchains.forEach((blockchain) => {
        if (
          blockchain.enabled &&
          blockchainsWithAtLeastOneToken.has(blockchain.name)
        ) {
          blockchains.push(blockchain);
        }
      });

      // Sort
      blockchains.sort((a, b) => a.sort - b.sort);

      set({
        _blockchains: blockchains,
        _tokens: tokens,
        _popularTokens: popularTokens,
        _swappers: swappers,
      });
    } catch (error) {
      set({ fetchStatus: 'failed' });
      throw error;
    }
  },
});
