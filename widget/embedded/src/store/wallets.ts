import { WalletDetailsResponse } from 'rango-sdk';
import { create } from 'zustand';

type WalletType = string;

export interface Account {
  blockchain: string;
  accounts: { address: string; walletType: WalletType }[];
}

export type WalletBalance = {
  chain: string;
  symbol: string;
  ticker: string;
  address: string | null;
  rawAmount: string;
  decimal: number | null;
  amount: string;
  logo: string | null;
  usdPrice: number | null;
};

interface AccountWithBalance {
  balances: WalletBalance[] | null;
  address: string;
  loading: boolean;
  walletType: WalletType;
  error: boolean;
  explorerUrl: string | null;
  isConnected: boolean;
}

interface Balance {
  blockchain: string;
  accountsWithBalance: AccountWithBalance[];
}

interface WalletsStore {
  accounts: Account[] | null;
  balance: Balance[] | null;
  insertAccount: (account: Account) => void;
  insertBalance: (walletDetails: WalletDetailsResponse['wallets']) => void;
}

export const useWalletsStore = create<WalletsStore>()((set) => ({
  accounts: null,
  balance: null,
  insertAccount: (account) => {},
  insertBalance: (walletDetails) => {},
}));
