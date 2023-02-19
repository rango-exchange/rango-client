import BigNumber from 'bignumber.js';
import { AccountWithBalance, Balance, WalletBalance } from '../store/wallets';

export const ZERO = new BigNumber(0);

export const getBalanceFromWallet = (
  balance: Balance[],
  blockchain: string,
  symbol: string,
  address: string | null,
): WalletBalance | null => {
  if (!balance) return null;

  const bc = balance.find((b) => b.blockchain === blockchain);
  if (!bc || bc.accountsWithBalance.length === 0) return null;

  return (
    bc.accountsWithBalance
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
