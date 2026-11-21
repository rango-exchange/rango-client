import type { StocksConfig } from '@rango-dev/widget-embedded';

import { STOCKS_TOKENS } from './stocksTokens';

/*
 * Mock stocks meta, in the shape the host app will pass to the widget.
 * Tokens are real (taken from Rango meta); asset class, liquidity and issuers are mocked.
 */
export const MOCK_STOCKS_META: StocksConfig['meta'] = {
  // The widget still uses its own meta for blockchains and swappers.
  blockchains: [],
  swappers: [],
  tokens: STOCKS_TOKENS,
  issuers: [
    {
      info: {
        logo: '',
        name: 'xStocks',
        website: 'https://xstocks.com',
      },
      chains: ['SOLANA', 'ETH', 'ARBITRUM', 'BSC'],
    },
    {
      info: {
        logo: 'https://cdn.ondo.finance/tokens/logos/tslaon_160x160.png',
        name: 'Ondo',
        website: 'https://ondo.finance',
      },
      chains: ['SOLANA', 'ETH', 'BSC'],
    },
  ],
};

export const STOCK_TICKERS = ['TSLA', 'AAPL', 'NVDA', 'SPY'];

export const USDC_ARBITRUM = {
  blockchain: 'ARBITRUM',
  symbol: 'USDC',
  address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
};
