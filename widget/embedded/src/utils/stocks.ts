import type { StocksToken } from '../types';

// Issuer suffixes are short, e.g. TSLA + 'x' (xStocks) or TSLA + 'on' (Ondo).
const MAX_ISSUER_SUFFIX_LENGTH = 2;

/**
 * Tokens don't have a ticker field yet, so the ticker is matched with the token symbol:
 * the symbol is the ticker itself, or the ticker followed by a short issuer suffix.
 * TODO: use an explicit ticker field when the server provides it.
 */
export function isTokenOfTicker(token: StocksToken, ticker: string) {
  const symbol = token.symbol.toUpperCase();
  const normalizedTicker = ticker.trim().toUpperCase();

  return (
    !!normalizedTicker &&
    symbol.startsWith(normalizedTicker) &&
    symbol.length - normalizedTicker.length <= MAX_ISSUER_SUFFIX_LENGTH
  );
}

export function isCryptoToken(token: StocksToken) {
  return token.assetClass === 'native' || token.assetClass === 'stablecoin';
}
