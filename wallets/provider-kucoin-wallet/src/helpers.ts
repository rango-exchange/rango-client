import { Network } from '@rango-dev/wallets-shared';

export function getKucoinInstance() {
  const { kucoin } = window;
  if (kucoin && kucoin.isKuCoinWallet) return kucoin;

  return null;
}

export const KUCOIN_WALLET_SUPPORTED_CHAINS = [
  Network.ETHEREUM,
  Network.POLYGON,
  Network.BSC,
];
