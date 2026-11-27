import type { ModeStrategy, SwapItemType } from './types';
import type { TradeDirection } from '../store/quote';
import type { AppStoreState } from '../store/slices/types';
import type { Balance, StocksToken } from '../types';
import type { Asset, Token } from 'rango-sdk';

import { i18n } from '@lingui/core';
import BigNumber from 'bignumber.js';

import { isTokenNative } from '../utils/meta';

const OTHER_CHAINS_SECTION_ID = 'other-chains';

/**
 * buy:  source = crypto, destination = stocks
 * sell: source = stocks, destination = crypto
 */
function listFor(type: SwapItemType, direction: TradeDirection) {
  return (type === 'source') === (direction === 'buy') ? 'crypto' : 'stocks';
}

function hasBalance(balance: Balance | null) {
  return !!balance && new BigNumber(balance.amount).isGreaterThan(0);
}

const compactUsdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export const stocksStrategy: ModeStrategy = {
  allowCustomTokens: false,
  blockchains: ({ store, type, direction }) => {
    const tokens = store.stocksTokens({ list: listFor(type, direction) });
    const blockchainNames = new Set(tokens.map((token) => token.blockchain));

    return store
      .blockchains()
      .filter((blockchain) => blockchainNames.has(blockchain.name));
  },
  tokenSections: ({ store, type, direction, blockchain, searchFor }) => {
    // Sorted by balance (desc), then native tokens, popularity, ...
    const tokens = store.stocksTokens({
      list: listFor(type, direction),
      searchFor,
      getBalanceFor: store.getBalanceFor,
    });
    const isOnSelectedBlockchain = (token: Token) =>
      token.blockchain === blockchain?.name;

    // Destination: every supported asset, with or without balance.
    if (type === 'destination') {
      return [
        {
          id: 'all',
          tokens: blockchain ? tokens.filter(isOnSelectedBlockchain) : tokens,
        },
      ];
    }

    // Search looks through the whole supported list, not only owned tokens.
    if (searchFor) {
      return [
        {
          id: 'all',
          tokens: blockchain ? tokens.filter(isOnSelectedBlockchain) : tokens,
        },
      ];
    }

    const ownedTokens = tokens.filter((token) =>
      hasBalance(store.getBalanceFor(token))
    );

    if (!blockchain) {
      if (ownedTokens.length) {
        return [{ id: 'all', tokens: ownedTokens }];
      }

      // No wallet or no balances: show native coins as the default list.
      const nativeTokens = tokens.filter((token) =>
        isTokenNative(token, store._blockchainsMapByName.get(token.blockchain))
      );
      return [
        { id: 'all', tokens: nativeTokens.length ? nativeTokens : tokens },
      ];
    }

    if (!ownedTokens.length) {
      return [{ id: 'all', tokens: tokens.filter(isOnSelectedBlockchain) }];
    }

    return [
      {
        id: 'selected-chain',
        title: i18n.t('Your tokens on {blockchain}', {
          blockchain: blockchain.displayName,
        }),
        tokens: ownedTokens.filter(isOnSelectedBlockchain),
      },
      {
        id: OTHER_CHAINS_SECTION_ID,
        title: i18n.t('Your other assets — routed across'),
        tokens: ownedTokens.filter((token) => !isOnSelectedBlockchain(token)),
      },
    ];
  },
  tokenItem: ({ store, token, sectionId }) => {
    const stocksToken = store.findStocksToken(token);

    return {
      // Issuer and liquidity are shown together; on hover they turn into the contract address.
      name:
        [
          stocksToken?.issuerId || token.name,
          stocksToken
            ? i18n.t('Liquidity {amount}', {
                amount: compactUsdFormatter.format(stocksToken.liquidity),
              })
            : null,
        ]
          .filter(Boolean)
          .join(' · ') || undefined,
      tags: [
        { label: token.blockchain, variant: 'blockchain' },
        ...(sectionId === OTHER_CHAINS_SECTION_ID
          ? [{ label: i18n.t('Bridge'), variant: 'bridge' as const }]
          : []),
      ],
    };
  },
  title: ({ store, direction }) => {
    const ticker = store.config.__UNSTABLE_OR_INTERNAL__?.stocks?.ticker ?? '';

    if (direction === 'buy') {
      return ticker ? i18n.t('Buy {asset}', { asset: ticker }) : i18n.t('Buy');
    }
    return ticker ? i18n.t('Sell {asset}', { asset: ticker }) : i18n.t('Sell');
  },
  chainLabel: ({ store, token, blockchain }) => {
    const blockchainName = blockchain?.displayName || '';
    const issuer = token ? store.findStocksToken(token)?.issuerId : undefined;

    return issuer && blockchainName
      ? `${issuer} · ${blockchainName}`
      : blockchainName;
  },
};

/**
 * Initial direction based on the default source token: selling if it is a stock.
 */
export function getInitialTradeDirection(
  store: AppStoreState,
  fromToken: Asset | undefined
): TradeDirection {
  const isStock =
    !!fromToken && store.findStocksToken(fromToken)?.assetClass === 'stocks';

  return isStock ? 'sell' : 'buy';
}

/**
 * The stock token to preselect for the configured ticker: the one with the most liquidity.
 */
export function getDefaultStocksToken(
  store: AppStoreState
): StocksToken | undefined {
  return store
    .stocksTokens({ list: 'stocks' })
    .reduce<StocksToken | undefined>(
      (best, token) =>
        !best || token.liquidity > best.liquidity ? token : best,
      undefined
    );
}
