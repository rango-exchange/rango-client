import { SelectableWallet } from '@rango-dev/ui';
import { WalletType } from '@rango-dev/wallets-shared';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { httpService } from '../services/httpService';
import {
  getRequiredChains,
  getTokensWithBalance,
  isAccountAndWalletMatched,
  makeBalanceFor,
  resetConnectedWalletState,
  sortTokens,
} from '../utils/wallets';
import { useBestRouteStore } from './bestRoute';
import { useMetaStore } from './meta';
import createSelectors from './selectors';
import { shallow } from 'zustand/shallow';
import { Wallet } from '../types';

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

export interface ConnectedWallet extends Wallet {
  balances: TokenBalance[] | null;
  loading: boolean;
  error: boolean;
  explorerUrl: string | null;
}

interface WalletsStore {
  connectedWallets: ConnectedWallet[];
  selectedWallets: Wallet[];
  connectWallet: (accounts: Wallet[]) => void;
  disconnectWallet: (walletType: WalletType) => void;
  initSelectedWallets: () => void;
  setSelectedWallet: (wallet: SelectableWallet) => void;
  clearConnectedWallet: () => void;
  getOneOfWalletsDetails: (account: Wallet) => void;
}

export const useWalletsStore = createSelectors(
  create<WalletsStore>()(
    subscribeWithSelector((set, get) => ({
      connectedWallets: [],
      selectedWallets: [],
      connectWallet: (accounts) => {
        const getOneOfWalletsDetails = get().getOneOfWalletsDetails;
        set((state) => ({
          connectedWallets: state.connectedWallets.concat(
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
          connectedWallets: state.connectedWallets.filter(
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
          const connectedWallets = state.connectedWallets;
          const selectedWallets: Wallet[] = [];
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
          connectedWallets: [],
          selectedWallets: [],
        })),
      getOneOfWalletsDetails: async (account: Wallet) => {
        const tokens = useMetaStore.getState().meta.tokens;
        set((state) => ({
          connectedWallets: state.connectedWallets.map((balance) => {
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
              connectedWallets: state.connectedWallets.map(
                (connectedWallet) => {
                  return isAccountAndWalletMatched(account, connectedWallet)
                    ? makeBalanceFor(account, retrivedBalance, tokens)
                    : connectedWallet;
                }
              ),
            }));
          } else throw new Error('Wallet not found');
        } catch (error) {
          set((state) => ({
            connectedWallets: state.connectedWallets.map((balance) => {
              return isAccountAndWalletMatched(account, balance)
                ? resetConnectedWalletState(balance)
                : balance;
            }),
          }));
        }
      },
    }))
  )
);

useWalletsStore.subscribe(
  (state) => state.connectedWallets,
  (connectedWallets) => {
    useBestRouteStore.setState(({ sourceTokens, destinationTokens }) => {
      const sourceTokensWithBalance = getTokensWithBalance(
        sourceTokens,
        connectedWallets
      );
      const destinationTokensWithBalance = getTokensWithBalance(
        destinationTokens,
        connectedWallets
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
  !!state.connectedWallets.find((wallet) => wallet.loading);
