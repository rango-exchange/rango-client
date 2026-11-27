// We keep all the received data from server in this slice

import type { ConfigSlice } from './config';
import type { SettingsSlice } from './settings';
import type { CachedEntries } from '../../services/cacheService';
import type {
  Balance,
  Blockchain,
  StocksIssuer,
  StocksToken,
  TokenHash,
} from '../../types';
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
import { isCryptoToken, isTokenOfTicker } from '../../utils/stocks';
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

type StocksTokenOptions = {
  // crypto: native and stablecoin tokens, stocks: stock tokens of the configured ticker
  list: 'crypto' | 'stocks';
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
  stocksTokens: (options: StocksTokenOptions) => StocksToken[];
  // Looks up the token in the stocks meta passed by the host app.
  findStocksToken: (asset: Asset) => StocksToken | undefined;
  findStocksIssuer: (asset: Asset) => StocksIssuer | undefined;
  swappers: () => SwapperMeta[];
  isTokenPinned: (token: Token, type: 'source' | 'destination') => boolean;
  findToken: FindToken;
  findNativeToken: (blockchain: BlockchainMeta) => Token | undefined;
  fetch: () => Promise<void>;
}

function filterAndSortTokens<T extends Token>(
  tokens: T[],
  options: {
    blockchain?: string;
    searchFor?: string;
    getBalanceFor?: (token: Token) => Balance | null;
    availableBlockchains: BlockchainMeta[];
    blockchainsMapByName: Map<string, BlockchainMeta>;
    isPinned?: (token: Token) => boolean;
  }
): T[] {
  const { blockchainsMapByName, availableBlockchains, isPinned } = options;

  return tokens
    .filter((token) => {
      // If a specific blockchain has passed, we only keep that blockchain's tokens.
      if (!!options.blockchain && token.blockchain !== options.blockchain) {
        return false;
      }

      // Check only available blockchains
      if (
        !availableBlockchains.some((blockchain) => {
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
      if (isPinned) {
        const isToken1Pinned = isPinned(tokenA);
        const isToken2Pinned = isPinned(tokenB);
        if (isToken1Pinned !== isToken2Pinned) {
          return isToken1Pinned ? -1 : 1;
        }
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

    return filterAndSortTokens(supportedTokens, {
      blockchain: options.blockchain,
      searchFor: options.searchFor,
      getBalanceFor: options.getBalanceFor,
      availableBlockchains: blockchains,
      blockchainsMapByName,
      isPinned: (token) => get().isTokenPinned(token, options.type),
    });
  },
  stocksTokens: (options) => {
    const { _blockchainsMapByName, config } = get();
    const stocks = config.__UNSTABLE_OR_INTERNAL__?.stocks;
    if (!stocks) {
      return [];
    }

    const cacheKey: keyof CachedEntries =
      options.list === 'crypto' ? 'stocksCryptoTokens' : 'stocksAssetTokens';
    let supportedTokens = cacheService.get(cacheKey);
    if (!supportedTokens) {
      supportedTokens = stocks.meta.tokens.filter((token) =>
        options.list === 'crypto'
          ? isCryptoToken(token)
          : token.assetClass === 'stocks' &&
            isTokenOfTicker(token, stocks.ticker)
      );
      cacheService.set(cacheKey, supportedTokens);
    }

    return filterAndSortTokens(supportedTokens, {
      blockchain: options.blockchain,
      searchFor: options.searchFor,
      getBalanceFor: options.getBalanceFor,
      availableBlockchains: Array.from(_blockchainsMapByName.values()),
      blockchainsMapByName: _blockchainsMapByName,
    });
  },
  findStocksToken: (asset) => {
    let tokensByHash = cacheService.get('stocksTokensByHash');
    if (!tokensByHash) {
      tokensByHash = new Map(
        (get().config.__UNSTABLE_OR_INTERNAL__?.stocks?.meta.tokens ?? []).map(
          (token) => [createTokenHash(token), token]
        )
      );
      cacheService.set('stocksTokensByHash', tokensByHash);
    }
    return tokensByHash.get(createTokenHash(asset));
  },
  findStocksIssuer: (asset) => {
    const issuerId = get().findStocksToken(asset)?.issuerId;
    if (!issuerId) {
      return undefined;
    }
    return get().config.__UNSTABLE_OR_INTERNAL__?.stocks?.meta.issuers.find(
      (issuer) => issuer.info.name === issuerId
    );
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
  findNativeToken: (blockchain: BlockchainMeta) => {
    const feeAsset = blockchain.feeAssets[0];
    return get().findToken({
      blockchain: blockchain.name,
      address: feeAsset.address,
      symbol: feeAsset.symbol,
    });
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
      const popularTokens: Token[] = response.popularTokens;
      const swappers: SwapperMeta[] = response.swappers.filter(
        (swapper) => swapper.enabled
      );

      const sortedBlockchain = response.blockchains.sort(
        (a, b) => a.sort - b.sort
      );

      sortedBlockchain.forEach((blockchain) => {
        if (blockchain.enabled) {
          blockchainsMapByName.set(blockchain.name, blockchain);
        }
      });

      response.tokens.forEach((token) => {
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
