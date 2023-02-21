import { Balance, TokenBalance } from '../store/wallets';

export const getBalanceFromWallet = (
  balances: Balance[],
  chain: string,
  symbol: string,
  address: string | null,
): TokenBalance | null => {
  if (balances.length === 0) return null;

  const selectedChainBalances = balances.filter((balance) => balance.chain === chain);
  if (selectedChainBalances.length === 0) return null;

  return (
    selectedChainBalances
      .map(
        (a) =>
          a.balances?.find(
            (bl) =>
              (address !== null && bl.address === address) ||
              (address === null && bl.address === address && bl.symbol === symbol),
          ) || null,
      )
      .filter((b) => b !== null)
      .sort((a, b) => parseFloat(b?.amount || '0') - parseFloat(a?.amount || '1'))
      .find(() => true) || null
  );
};
