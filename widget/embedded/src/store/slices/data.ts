// We keep all the received data from server in this slice

import type { ConfigSlice } from './config';
import type { Balance, TokenHash } from '../../types';
import type { Asset, BlockchainMeta, SwapperMeta, Token } from 'rango-sdk';
import type { StateCreator } from 'zustand';

import { httpService as sdk } from '../../services/httpService';
import { compareWithSearchFor, containsText } from '../../utils/common';
import { isTokenExcludedInConfig } from '../../utils/configs';
import { createTokenHash, isTokenNative } from '../../utils/meta';
import { sortLiquiditySourcesByGroupTitle } from '../../utils/settings';
import { areTokensEqual, compareTokenBalance } from '../../utils/wallets';

type BlockchainOptions = {
  type?: 'source' | 'destination';
};

type TokenOptions = {
  type: 'source' | 'destination';
  // filter by an specific blockchain
  blockchain?: string;
  searchFor?: string;
  getBalanceFor?: (token: Token) => Balance | null;
};

export type FindToken = (asset: Asset) => Token | undefined;

export type FetchStatus = 'loading' | 'success' | 'failed';
export interface DataSlice {
  _blockchainsMapByName: Map<string, BlockchainMeta>;
  _tokensMapByTokenHash: Map<TokenHash, Token>;
  _popularTokens: Token[];
  _swappers: SwapperMeta[];
  fetchStatus: FetchStatus;
  blockchains: (options?: BlockchainOptions) => BlockchainMeta[];
  tokens: (options?: TokenOptions) => Token[];
  swappers: () => SwapperMeta[];
  isTokenPinned: (token: Token, type: 'source' | 'destination') => boolean;
  findToken: FindToken;
  fetch: () => Promise<void>;
}

export const createDataSlice: StateCreator<
  DataSlice & ConfigSlice,
  [],
  [],
  DataSlice
> = (set, get) => ({
  // State
  _blockchainsMapByName: new Map<string, BlockchainMeta>(),
  _tokensMapByTokenHash: new Map<TokenHash, Token>(),
  _popularTokens: [],
  _swappers: [],
  fetchStatus: 'loading',
  // Selectors
  blockchains: (options) => {
    const blockchainsMapByName = get()._blockchainsMapByName;
    const blockchainsFromState = Array.from(
      blockchainsMapByName?.values() || []
    );

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
    const tokensMapByHashToken = get()._tokensMapByTokenHash;
    const tokensFromState = Array.from(tokensMapByHashToken?.values() || []);
    const blockchainsMapByName = get()._blockchainsMapByName;

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
      .sort((tokenA, tokenB) => {
        //1. sort by pinned tokens
        const isToken1Pinned = get().isTokenPinned(tokenA, options.type);
        const isToken2Pinned = get().isTokenPinned(tokenB, options.type);
        if (isToken1Pinned !== isToken2Pinned) {
          return isToken1Pinned ? -1 : 1;
        }

        //2. sort by balance
        if (options.getBalanceFor) {
          const token1Balance = options.getBalanceFor(tokenA);
          const token2Balance = options.getBalanceFor(tokenB);
          const balanceCompare = compareTokenBalance(
            token1Balance,
            token2Balance
          );
          if (balanceCompare !== 0) {
            return balanceCompare;
          }
        }

        const blockChainA = blockchainsMapByName.get(tokenA.blockchain);
        const blockChainB = blockchainsMapByName.get(tokenB.blockchain);

        //3. sort by native token
        const isNativeTokenA = isTokenNative(tokenA, blockChainA);
        const isNativeTokenB = isTokenNative(tokenB, blockChainB);
        if (isNativeTokenA !== isNativeTokenB) {
          return isNativeTokenA ? -1 : 1;
        }

        //4. sort by token popularity
        if (tokenA.isPopular !== tokenB.isPopular) {
          return tokenA.isPopular ? -1 : 1;
        }

        //5. sort by search phrase
        if (options.searchFor) {
          const symbolSearchForCompare = compareWithSearchFor(
            tokenA,
            tokenB,
            options.searchFor
          );
          if (symbolSearchForCompare) {
            return symbolSearchForCompare;
          }
        }

        //6. sort by token isSecondary
        if (tokenA.isSecondaryCoin !== tokenB.isSecondaryCoin) {
          return tokenA.isSecondaryCoin ? 1 : -1;
        }

        //7. sort by blockchain order
        if (!!blockChainA && !!blockChainB) {
          return blockChainA.sort - blockChainB.sort;
        }

        return 0;
      });

    return list;
  },
  findToken: (asset) => {
    const tokensMapByHashToken = get()._tokensMapByTokenHash;
    const tokenHash = createTokenHash(asset);
    const token = tokensMapByHashToken.get(tokenHash);
    return token;
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

    const excludeLiquiditySources = campaignModeLiquiditySource
      ? false
      : config.excludeLiquiditySources;

    /*
     * If the excludeLiquiditySources flag is set to true, we return all swappers that are not included in the config.
     * Otherwise, we return all swappers that are included in the config.
     */
    const swappers = get()._swappers.filter((swapper) => {
      const swapperGroupIncludedInLiquiditySources = liquiditySources?.includes(
        swapper.swapperGroup
      );

      const shouldExcludeLiquiditySources =
        excludeLiquiditySources ||
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
      const { enableCentralizedSwappers } = get().config;
      const response = await sdk().getAllMetadata({
        enableCentralizedSwappers,
      });

      set({ fetchStatus: 'success' });
      const blockchainsMapByName: Map<string, BlockchainMeta> = new Map<
        string,
        BlockchainMeta
      >();

      const tokensMapByHashToken: Map<TokenHash, Token> = new Map<
        TokenHash,
        Token
      >();
      const tokens: Token[] = [];
      const popularTokens: Token[] = response.popularTokens;
      const swappers: SwapperMeta[] = response.swappers;

      const blockchainsWithAtLeastOneToken = new Set();

      response.tokens.forEach((token) => {
        blockchainsWithAtLeastOneToken.add(token.blockchain);

        tokens.push(token);
      });

      const sortedBlockchain = response.blockchains.sort(
        (a, b) => a.sort - b.sort
      );

      sortedBlockchain.forEach((blockchain) => {
        if (
          blockchain.enabled &&
          blockchainsWithAtLeastOneToken.has(blockchain.name)
        ) {
          blockchainsMapByName.set(blockchain.name, blockchain);
        }
      });

      tokens.forEach((token) => {
        const tokenHash = createTokenHash(token);
        tokensMapByHashToken.set(tokenHash, token);
      });

      set({
        _blockchainsMapByName: blockchainsMapByName,
        _tokensMapByTokenHash: tokensMapByHashToken,
        _popularTokens: popularTokens,
        _swappers: swappers,
      });
    } catch (error) {
      set({ fetchStatus: 'failed' });
      throw error;
    }
  },
});
