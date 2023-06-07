import { Network } from '@rango-dev/wallets-shared';

export function taho() {
  const { tally } = window;

  if (!tally) return null;

  return tally;
}

export const TAHO_WALLET_SUPPORTED_CHAINS = [
  Network.ETHEREUM,
  Network.POLYGON,
  Network.OPTIMISM,
  Network.ARBITRUM,
  Network.AVAX_CCHAIN,
  Network.BINANCE,
];
