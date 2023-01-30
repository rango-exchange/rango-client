export function kuCoin() {
  const { kucoin }: any = window;
  if (kucoin && kucoin.isKuCoinWallet) return kucoin;

  return null;
}
