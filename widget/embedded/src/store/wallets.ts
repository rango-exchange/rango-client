import { WalletType } from '@rangodev/wallets-shared';
import BigNumber from 'bignumber.js';
import { WalletDetail } from 'rango-sdk';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { SelectableWallet } from '../pages/ConfirmWalletsPage';
import { getRequiredChains, SelectedWallet } from '../utils/wallets';
import { useBestRouteStore } from './bestRoute';

export interface Account {
  blockchain: string;
  address: string;
  walletType: WalletType;
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

export interface Balance {
  balances: WalletBalance[] | null;
  address: string;
  chain: string;
  loading: boolean;
  walletType: WalletType;
  error: boolean;
  explorerUrl: string | null;
  isConnected: boolean;
}

interface WalletsStore {
  accounts: Account[];
  balances: Balance[];
  selectedWallets: SelectedWallet[];
  insertAccountAndBalance: (accounts: Account[]) => void;
  disconnectWallet: (walletType: WalletType) => void;
  initSelectedWallets: () => void;
  setSelectedWallet: (wallet: SelectableWallet) => void;
}

export const useWalletsStore = create<WalletsStore>()((set, get) => ({
  accounts: [],
  balances: [],
  selectedWallets: [],
  insertAccountAndBalance: (accounts) => {
    //
  },
  disconnectWallet: (walletType) => {
    set((state) => ({
      accounts: state.accounts.filter((account) => account.walletType !== walletType),
      balances: state.balances.filter((balance) => balance.walletType !== walletType),
    }));
  },
  initSelectedWallets: () => {
    //
  },
  setSelectedWallet: (wallet) =>
    set((state) => ({
      selectedWallets: state.selectedWallets
        .filter((selectedWallet) => selectedWallet.blockchain !== wallet.blockchain)
        .concat({
          blockchain: wallet.blockchain,
          address: wallet.address,
          walletType: wallet.walletType,
        }),
    })),
}));
