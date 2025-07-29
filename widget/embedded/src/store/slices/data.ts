// We keep all the received data from server in this slice

import type { ConfigSlice } from './config';
import type { SettingsSlice } from './settings';
import type { CachedEntries } from '../../services/cacheService';
import type { Balance, Blockchain, TokenHash } from '../../types';
import type { StateCreator } from 'zustand';

import {
  type Asset,
  type BlockchainMeta,
  type SwapperMeta,
  type Token,
} from 'rango-sdk';

import { ACTIVE_BLOCKCHAINS_FOR_CUSTOM_TOKENS } from '../../constants/customTokens';
import { cacheService } from '../../services/cacheService';
import { httpService as sdk } from '../../services/httpService';
import { compareWithSearchFor, containsText } from '../../utils/common';
import { createTokenHash, isTokenNative } from '../../utils/meta';
import {
  addCustomTokensToSupportedTokens,
  isRoutingEnabled,
  sortLiquiditySourcesByGroupTitle,
} from '../../utils/settings';
import { areTokensEqual, compareTokenBalance } from '../../utils/wallets';
import {
  getSupportedBlockchainsFromConfig,
  matchTokensFromConfigWithMeta,
} from '../utils';

type BlockchainOptions = {
  type?: 'source' | 'destination' | 'custom-token';
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
  _tokensMapByBlockchainName: Record<Blockchain, TokenHash[]>;
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
  DataSlice & ConfigSlice & SettingsSlice,
  [],
  [],
  DataSlice
> = (set, get) => ({
  // State
  _blockchainsMapByName: new Map(),
  _tokensMapByTokenHash: new Map(),
  _tokensMapByBlockchainName: {},
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

    if (options.type === 'custom-token') {
      const supportedBlockchainsFromConfig = getSupportedBlockchainsFromConfig({
        config,
      });

      let supportedBlockchains: BlockchainMeta[] = blockchainsFromState;

      /*
       * Supported blockchains can be configured and be limited.
       * In this case, we only keep those active blockchains which exist in config.
       */
      if (supportedBlockchainsFromConfig.length > 0) {
        supportedBlockchains = supportedBlockchains.filter((blockchain) =>
          supportedBlockchainsFromConfig.includes(blockchain.name)
        );
      }

      return supportedBlockchains.filter((blockchain) =>
        ACTIVE_BLOCKCHAINS_FOR_CUSTOM_TOKENS.includes(blockchain.type)
      );
    }

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
    const {
      _tokensMapByTokenHash,
      _tokensMapByBlockchainName,
      config,
      _customTokens,
    } = get();
    const tokensFromState = Array.from(_tokensMapByTokenHash.values());
    const blockchainsMapByName = get()._blockchainsMapByName;
    if (!options || !options.type) {
      return tokensFromState;
    }

    const configType = options.type === 'source' ? 'from' : 'to';
    const cacheKey: keyof CachedEntries =
      options.type === 'source'
        ? 'supportedSourceTokens'
        : 'supportedDestinationTokens';

    let supportedTokens = cacheService.get(cacheKey);
    if (!supportedTokens?.length) {
      supportedTokens = matchTokensFromConfigWithMeta({
        type: options.type,
        config: {
          blockchains: config[configType]?.blockchains,
          tokens: config[configType]?.tokens,
        },
        meta: {
          tokensMapByTokenHash: _tokensMapByTokenHash,
          tokensMapByBlockchainName: _tokensMapByBlockchainName,
        },
      });
      cacheService.set(cacheKey, supportedTokens);
    }

    supportedTokens = addCustomTokensToSupportedTokens(
      supportedTokens,
      _customTokens,
      config.features
    );

    const blockchains = get().blockchains({
      type: options.type,
    });

    const list = supportedTokens
      .filter((token) => {
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
    const customTokens = get().customTokens();
    const tokenHash = createTokenHash(asset);
    let token = tokensMapByHashToken.get(tokenHash);
    if (!token) {
      token = customTokens.find(
        (customToken) => createTokenHash(customToken) === tokenHash
      );
    }
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
      const { routing } = get().config;
      const enableCentralizedSwappers = isRoutingEnabled(
        'enableCentralizedSwappers',
        routing
      );

      const response = await sdk().getAllMetadata({
        enableCentralizedSwappers,
      });
      set({ fetchStatus: 'success' });
      const blockchainsMapByName: Map<string, BlockchainMeta> = new Map<
        string,
        BlockchainMeta
      >();

      const tokensMapByTokenHash: Map<TokenHash, Token> = new Map<
        TokenHash,
        Token
      >();
      const tokensMapByBlockchainName: DataSlice['_tokensMapByBlockchainName'] =
        {};
      const tokens: Token[] = [];
      const popularTokens: Token[] = response.popularTokens;
      const swappers: SwapperMeta[] = response.swappers.filter(
        (swapper) => swapper.enabled
      );
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
        if (!tokensMapByBlockchainName[token.blockchain]) {
          tokensMapByBlockchainName[token.blockchain] = [];
        }
        tokensMapByTokenHash.set(tokenHash, token);
        tokensMapByBlockchainName[token.blockchain]?.push(tokenHash);
      });

      set({
        _blockchainsMapByName: blockchainsMapByName,
        _tokensMapByTokenHash: tokensMapByTokenHash,
        _tokensMapByBlockchainName: tokensMapByBlockchainName,
        _popularTokens: popularTokens,
        _swappers: swappers,
      });
    } catch (error) {
      set({ fetchStatus: 'failed' });
      throw error;
    }
  },
});
