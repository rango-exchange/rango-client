import { WalletType } from '@rangodev/wallets-shared';
import BigNumber from 'bignumber.js';
import { create } from 'zustand';
import { SelectableWallet } from '../pages/ConfirmWalletsPage';
import { httpService } from '../services/httpService';
import { getRequiredChains, isAccountAndBalanceMatch, SelectedWallet } from '../utils/wallets';
import { useBestRouteStore } from './bestRoute';

export interface Account {
  chain: string;
  address: string;
  walletType: WalletType;
}

export type TokenBalance = {
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
  balances: TokenBalance[] | null;
  address: string;
  chain: string;
  loading: boolean;
  walletType: WalletType;
  error: boolean;
  explorerUrl: string | null;
}

interface WalletsStore {
  accounts: Account[];
  balances: Balance[];
  selectedWallets: SelectedWallet[];
  connectWallet: (accounts: Account[]) => void;
  disconnectWallet: (walletType: WalletType) => void;
  initSelectedWallets: () => void;
  setSelectedWallet: (wallet: SelectableWallet) => void;
}

export const useWalletsStore = create<WalletsStore>()((set, get) => ({
  accounts: [],
  balances: [],
  selectedWallets: [],
  connectWallet: (accounts) => {
    set((state) => ({
      accounts: state.accounts.concat(accounts),
      balances: state.balances.concat(
        accounts.map((account) => ({
          balances: [],
          address: account.address,
          chain: account.chain,
          loading: true,
          walletType: account.walletType,
          error: false,
          explorerUrl: null,
        })),
      ),
    }));
    accounts.forEach(async (account) => {
      try {
        const response = await httpService.getWalletsDetails([
          { address: account.address, blockchain: account.chain },
        ]);
        const retrivedBalance = response.wallets.find(() => true);
        if (retrivedBalance) {
          set((state) => ({
            balances: state.balances.map((balance) => {
              if (isAccountAndBalanceMatch(account, balance)) {
                return {
                  address: retrivedBalance.address,
                  chain: retrivedBalance.blockChain,
                  loading: false,
                  error: false,
                  explorerUrl: retrivedBalance.explorerUrl,
                  walletType: account.walletType,
                  balances:
                    retrivedBalance.balances?.map((tokenBalance) => ({
                      chain: retrivedBalance.blockChain,
                      symbol: tokenBalance.asset.symbol,
                      ticker: tokenBalance.asset.symbol,
                      address: tokenBalance.asset.address || null,
                      rawAmount: tokenBalance.amount.amount,
                      decimal: tokenBalance.amount.decimals,
                      amount: new BigNumber(tokenBalance.amount.amount)
                        .shiftedBy(-tokenBalance.amount.decimals)
                        .toFixed(),
                      logo: '',
                      usdPrice: null,
                    })) || [],
                };
              } else {
                return balance;
              }
            }),
          }));
        } else throw new Error('Wallet not found');
      } catch (error) {
        set((state) => ({
          balances: state.balances.map((balance) => {
            if (isAccountAndBalanceMatch(account, balance)) {
              return { ...balance, loading: false, error: true };
            } else return balance;
          }),
        }));
      }
    });
  },
  disconnectWallet: (walletType) => {
    set((state) => ({
      accounts: state.accounts.filter((account) => account.walletType !== walletType),
      balances: state.balances.filter((balance) => balance.walletType !== walletType),
      selectedWallets: state.selectedWallets.filter((wallet) => wallet.walletType != walletType),
    }));
  },
  initSelectedWallets: () =>
    set((state) => {
      const requiredChains = getRequiredChains(useBestRouteStore.getState().bestRoute);
      const connectedWallets = state.accounts;
      const selectedWallets: SelectedWallet[] = [];
      requiredChains.forEach((chain) => {
        const anyWalletSelected = !!state.selectedWallets.find((wallet) => wallet.chain === chain);
        if (!anyWalletSelected) {
          const firstWalletWithMatchedChain = connectedWallets.find(
            (wallet) => wallet.chain === chain,
          );
          if (!!firstWalletWithMatchedChain)
            selectedWallets.push({
              address: firstWalletWithMatchedChain.address,
              chain: firstWalletWithMatchedChain.chain,
              walletType: firstWalletWithMatchedChain.walletType,
            });
        }
      });
      return { selectedWallets: state.selectedWallets.concat(selectedWallets) };
    }),
  setSelectedWallet: (wallet) =>
    set((state) => ({
      selectedWallets: state.selectedWallets
        .filter((selectedWallet) => selectedWallet.chain !== wallet.chain)
        .concat({
          chain: wallet.chain,
          address: wallet.address,
          walletType: wallet.walletType,
        }),
    })),
}));
