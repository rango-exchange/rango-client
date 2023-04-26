import { SelectableWallet } from '@rango-dev/ui';
import { WalletType } from '@rango-dev/wallets-shared';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { httpService } from '../services/httpService';
import {
  getRequiredChains,
  getTokensWithBalance,
  isAccountAndBalanceMatched,
  makeBalanceFor,
  resetBalanceState,
  SelectedWallet,
  sortTokens,
} from '../utils/wallets';
import { useBestRouteStore } from './bestRoute';
import { useMetaStore } from './meta';
import createSelectors from './selectors';
import { shallow } from 'zustand/shallow';

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
  clearConnectedWallet: () => void;
  getOneOfWalletsDetails: (account: Account) => void;
}

export const useWalletsStore = createSelectors(
  create<WalletsStore>()(
    subscribeWithSelector((set, get) => ({
      accounts: [],
      balances: [],
      selectedWallets: [],
      connectWallet: (accounts) => {
        const getOneOfWalletsDetails = get().getOneOfWalletsDetails;
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
            }))
          ),
        }));
        accounts.forEach(async (account) => getOneOfWalletsDetails(account));
      },
      disconnectWallet: (walletType) => {
        set((state) => ({
          accounts: state.accounts.filter(
            (account) => account.walletType !== walletType
          ),
          balances: state.balances.filter(
            (balance) => balance.walletType !== walletType
          ),
          selectedWallets: state.selectedWallets.filter(
            (wallet) => wallet.walletType != walletType
          ),
        }));
      },
      initSelectedWallets: () =>
        set((state) => {
          const requiredChains = getRequiredChains(
            useBestRouteStore.getState().bestRoute
          );
          const connectedWallets = state.accounts;
          const selectedWallets: SelectedWallet[] = [];
          requiredChains.forEach((chain) => {
            const anyWalletSelected = !!state.selectedWallets.find(
              (wallet) => wallet.chain === chain
            );
            if (!anyWalletSelected) {
              const firstWalletWithMatchedChain = connectedWallets.find(
                (wallet) => wallet.chain === chain
              );
              if (!!firstWalletWithMatchedChain)
                selectedWallets.push({
                  address: firstWalletWithMatchedChain.address,
                  chain: firstWalletWithMatchedChain.chain,
                  walletType: firstWalletWithMatchedChain.walletType,
                });
            }
          });
          return {
            selectedWallets: state.selectedWallets.concat(selectedWallets),
          };
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

      clearConnectedWallet: () =>
        set(() => ({
          accounts: [],
          balances: [],
          selectedWallets: [],
        })),
      getOneOfWalletsDetails: async (account: Account) => {
        const tokens = useMetaStore.getState().meta.tokens;
        set((state) => ({
          balances: state.balances.map((balance) => {
            return balance.address === account.address &&
              balance.chain === account.chain
              ? { ...balance, loading: true }
              : balance;
          }),
        }));
        try {
          const response = await httpService().getWalletsDetails([
            { address: account.address, blockchain: account.chain },
          ]);
          const retrivedBalance = response.wallets[0];
          if (retrivedBalance) {
            set((state) => ({
              balances: state.balances.map((balance) => {
                return isAccountAndBalanceMatched(account, balance)
                  ? makeBalanceFor(account, retrivedBalance, tokens)
                  : balance;
              }),
            }));
          } else throw new Error('Wallet not found');
        } catch (error) {
          set((state) => ({
            balances: state.balances.map((balance) => {
              return isAccountAndBalanceMatched(account, balance)
                ? resetBalanceState(balance)
                : balance;
            }),
          }));
        }
      },
    }))
  )
);

useWalletsStore.subscribe(
  (state) => state.balances,
  (balances) => {
    useBestRouteStore.setState(({ sourceTokens, destinationTokens }) => {
      const sourceTokensWithBalance = getTokensWithBalance(
        sourceTokens,
        balances
      );
      const destinationTokensWithBalance = getTokensWithBalance(
        destinationTokens,
        balances
      );
      return {
        sourceTokens: sortTokens(sourceTokensWithBalance),
        destinationTokens: sortTokens(destinationTokensWithBalance),
      };
    });
  },
  {
    equalityFn: shallow,
  }
);

export const fetchingBalanceSelector = (state: WalletsStore) =>
  !!state.balances.find((wallet) => wallet.loading);
