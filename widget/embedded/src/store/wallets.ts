import type { Wallet } from '../types';
import type { WalletType } from '@rango-dev/wallets-shared';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

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
  explorerUrl: string | null;
  selected: boolean;
  loading: boolean;
  error: boolean;
}

interface WalletsStore {
  connectedWallets: ConnectedWallet[];
  customDestination: string;
  connectWallet: (accounts: Wallet[]) => void;
  disconnectWallet: (walletType: WalletType) => void;
  initSelectedWallets: () => void;
  selectWallets: (wallets: { walletType: string; chain: string }[]) => void;
  clearConnectedWallet: () => void;
  getWalletsDetails: (accounts: Wallet[], shouldRetry?: boolean) => void;
  setCustomDestination: (customDestination: string) => void;
}

export const useWalletsStore = createSelectors(
  create<WalletsStore>()(
    subscribeWithSelector((set, get) => ({
      connectedWallets: [],
      selectedWallets: [],
      customDestination: '',
      connectWallet: (accounts) => {
        const getWalletsDetails = get().getWalletsDetails;
        set((state) => ({
          connectedWallets: state.connectedWallets
            .filter((wallet) => wallet.walletType !== accounts[0].walletType)
            .concat(
              accounts.map((account) => ({
                balances: [],
                address: account.address,
                chain: account.chain,
                explorerUrl: null,
                walletType: account.walletType,
                selected: false,
                loading: true,
                error: false,
              }))
            ),
        }));
        getWalletsDetails(accounts);
      },
      disconnectWallet: (walletType) => {
        set((state) => ({
          connectedWallets: state.connectedWallets.filter(
            (balance) => balance.walletType !== walletType
          ),
        }));
      },
      initSelectedWallets: () =>
        set((state) => {
          const requiredChains = getRequiredChains(
            useBestRouteStore.getState().bestRoute
          );
          const connectedWallets = state.connectedWallets;
          const selectedWallets: string[] = [];
          requiredChains.forEach((chain) => {
            const anyWalletSelected = !!state.connectedWallets.find(
              (connectedWallet) =>
                connectedWallet.chain === chain && connectedWallet.selected
            );

            if (!anyWalletSelected) {
              const firstWalletWithMatchedChain = connectedWallets.find(
                (wallet) => wallet.chain === chain
              );
              if (firstWalletWithMatchedChain) {
                selectedWallets.push(firstWalletWithMatchedChain.walletType);
              }
            }
          });
          return {
            connectedWallets: state.connectedWallets.map((connectedWallet) => {
              if (
                selectedWallets.includes(connectedWallet.walletType) &&
                !connectedWallet.selected
              ) {
                return { ...connectedWallet, selected: true };
              }
              return connectedWallet;
            }),
          };
        }),
      selectWallets: (wallets) =>
        set((state) => ({
          connectedWallets: state.connectedWallets.map((connectedWallet) => {
            const selected = wallets.find(
              (wallet) =>
                wallet.chain === connectedWallet.chain &&
                wallet.walletType === connectedWallet.walletType &&
                !connectedWallet.selected
            );
            if (selected) {
              return { ...connectedWallet, selected: true };
            }
            return connectedWallet;
          }),
        })),
      setCustomDestination: (customDestination) =>
        set(() => ({
          customDestination,
        })),
      clearConnectedWallet: () =>
        set(() => ({
          connectedWallets: [],
          selectedWallets: [],
        })),
      getWalletsDetails: async (accounts, shouldRetry = true) => {
        const getWalletsDetails = get().getWalletsDetails;
        const { tokens } = useMetaStore.getState().meta;
        set((state) => ({
          connectedWallets: state.connectedWallets.map((wallet) => {
            return accounts.find((account) =>
              isAccountAndWalletMatched(account, wallet)
            )
              ? { ...wallet, loading: true }
              : wallet;
          }),
        }));
        try {
          const data = accounts.map(({ address, chain }) => ({
            address,
            blockchain: chain,
          }));
          const response = await httpService().getWalletsDetails(data);
          const retrievedBalance = response.wallets;
          if (retrievedBalance) {
            set((state) => ({
              connectedWallets: state.connectedWallets.map(
                (connectedWallet) => {
                  const matchedAccount = accounts.find((account) =>
                    isAccountAndWalletMatched(account, connectedWallet)
                  );
                  const retrievedBalanceAccount = retrievedBalance.find(
                    (balance) =>
                      balance.address === connectedWallet.address &&
                      balance.blockChain === connectedWallet.chain
                  );
                  if (
                    retrievedBalanceAccount?.failed &&
                    matchedAccount &&
                    shouldRetry
                  ) {
                    getWalletsDetails([matchedAccount], false);
                  }
                  return matchedAccount && retrievedBalanceAccount
                    ? makeBalanceFor(
                        matchedAccount,
                        retrievedBalanceAccount,
                        tokens
                      )
                    : connectedWallet;
                }
              ),
            }));
          } else {
            throw new Error('Wallet not found');
          }
        } catch (error) {
          set((state) => ({
            connectedWallets: state.connectedWallets.map((balance) => {
              return accounts.find((account) =>
                isAccountAndWalletMatched(account, balance)
              )
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
