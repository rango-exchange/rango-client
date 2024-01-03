import { Networks } from '@yeager-dev/wallets-shared';

export function getHaloInstance() {
  const { kucoin } = window;
  if (kucoin && kucoin.isKuCoinWallet) {
    return kucoin;
  }

  return null;
}

export const HALO_WALLET_SUPPORTED_CHAINS = [
  Networks.ETHEREUM,
  Networks.POLYGON,
  Networks.BSC,
];
