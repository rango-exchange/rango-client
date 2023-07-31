import { Networks } from '@rango-dev/wallets-shared';

export function getKucoinInstance() {
  const { kucoin } = window;
  if (kucoin && kucoin.isKuCoinWallet) return kucoin;

  return null;
}

export const KUCOIN_WALLET_SUPPORTED_CHAINS = [
  Networks.ETHEREUM,
  Networks.POLYGON,
  Networks.BSC,
];
