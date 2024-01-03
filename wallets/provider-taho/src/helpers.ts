import { Networks } from '@yeager-dev/wallets-shared';

export function taho() {
  const { tally } = window;

  if (!tally) return null;

  return tally;
}

export const TAHO_WALLET_SUPPORTED_CHAINS = [
  Networks.ETHEREUM,
  Networks.POLYGON,
  Networks.OPTIMISM,
  Networks.ARBITRUM,
  Networks.AVAX_CCHAIN,
  Networks.BINANCE,
];
