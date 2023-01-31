import { Network } from '@rangodev/wallets-shared';


export function kuCoin() {
  const { kucoin } = window;
  if (kucoin && kucoin.isKuCoinWallet) return kucoin;

  return null;
}

const BNB_SYMBOL = "BNB";


export const KUCOIN_WALLET_SUPPORTED_CHAINS = [
  Network.ETHEREUM,
  Network.POLYGON,
  BNB_SYMBOL,
];