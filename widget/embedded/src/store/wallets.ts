import type { FindToken } from './slices/data';
import type { Balance, TokensBalance, Wallet } from '../types';
import type { WalletType } from '@rango-dev/wallets-shared';
import type { Token } from 'rango-sdk';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { httpService } from '../services/httpService';
import { createTokenHash } from '../utils/meta';
import {
  isAccountAndWalletMatched,
  makeBalanceFor,
  makeTokensBalance,
  resetConnectedWalletState,
} from '../utils/wallets';

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
  balances: TokensBalance;
  loading: boolean;
  connectWallet: (accounts: Wallet[], findToken: FindToken) => void;
  disconnectWallet: (walletType: WalletType) => void;
  selectWallets: (wallets: { walletType: string; chain: string }[]) => void;
  clearConnectedWallet: () => void;
  getWalletsDetails: (
    accounts: Wallet[],
    findToken: FindToken,
    shouldRetry?: boolean
  ) => void;
  getBalanceFor: (token: Token) => Balance | null;
}

export const useWalletsStore = createSelectors(
  create<WalletsStore>()(
    subscribeWithSelector((set, get) => ({
      connectedWallets: [],
      balances: {},
      loading: false,
      connectWallet: (accounts, findToken) => {
        const getWalletsDetails = get().getWalletsDetails;

        set((state) => {
          const nextConnectedWallets = state.connectedWallets;

          /**
           * In some cases like changing account, this function will be called as well. which means walletType (name) + blockchain will be same but the address will be different.
           * To handle this scenario we need to make sure getting rid of the old entry and add new one to `connectedWallets`.
           * In other cases (a new account is adding to list), we simply push it to `connectedList`
           */
          for (const account of accounts) {
            const shouldMarkWalletAsSelected = !state.connectedWallets.some(
              (connectedWallet) =>
                connectedWallet.chain === account.chain &&
                connectedWallet.selected &&
                /**
                 * Sometimes, the connect function can be called multiple times for a particular wallet type when using the auto-connect feature.
                 * This check is there to make sure the chosen wallet doesn't end up unselected.
                 */
                connectedWallet.walletType !== account.walletType
            );

            const newConnectedWallet = {
              balances: [],
              address: account.address,
              chain: account.chain,
              explorerUrl: null,
              walletType: account.walletType,
              selected: shouldMarkWalletAsSelected,
              loading: true,
              error: false,
            };

            const sameWalletAndBlockchainAccountIndexInConnectedWallets =
              nextConnectedWallets.findIndex(
                (connectedWallet) =>
                  connectedWallet.walletType === account.walletType &&
                  connectedWallet.chain === account.chain
              );

            const sameWalletAndBlockchainConnectedWallet:
              | ConnectedWallet
              | undefined =
              state.connectedWallets[
                sameWalletAndBlockchainAccountIndexInConnectedWallets
              ];

            const isSameWalletAndBlockchainAdded =
              sameWalletAndBlockchainAccountIndexInConnectedWallets >= 0;

            const isSameAddressExists = sameWalletAndBlockchainConnectedWallet
              ? sameWalletAndBlockchainConnectedWallet.address ===
                account.address
              : false;

            if (isSameWalletAndBlockchainAdded) {
              if (!isSameAddressExists) {
                /*
                 * Mutating original object isn't good generally, to avoid copying memory over and over I chose this path for now.
                 * We can change it to copying the original object and then mutating the copied version in future if needed.
                 */
                state.connectedWallets[
                  sameWalletAndBlockchainAccountIndexInConnectedWallets
                ] = newConnectedWallet;
              }

              // if same entry (walletType + blockchain + address) exists, we simply ignore it.
            } else {
              nextConnectedWallets.push(newConnectedWallet);
            }
          }

          return {
            loading: true,
            connectedWallets: nextConnectedWallets,
          };
        });
        getWalletsDetails(accounts, findToken);
      },
      disconnectWallet: (walletType) => {
        set((state) => {
          const selectedWallets = state.connectedWallets
            .filter(
              (connectedWallet) =>
                connectedWallet.selected &&
                connectedWallet.walletType !== walletType
            )
            .map((selectedWallet) => selectedWallet.chain);

          const connectedWallets = state.connectedWallets
            .filter(
              (connectedWallet) => connectedWallet.walletType !== walletType
            )
            .map((connectedWallet) => {
              const anyWalletSelectedForBlockchain = selectedWallets.includes(
                connectedWallet.chain
              );
              if (anyWalletSelectedForBlockchain) {
                return connectedWallet;
              }
              selectedWallets.push(connectedWallet.chain);
              return { ...connectedWallet, selected: true };
            });

          const balances = makeTokensBalance(connectedWallets);

          return {
            balances,
            connectedWallets,
          };
        });
      },
      selectWallets: (wallets) =>
        set((state) => ({
          connectedWallets: state.connectedWallets.map((connectedWallet) => {
            const walletSelected = !!wallets.find(
              (wallet) =>
                wallet.chain === connectedWallet.chain &&
                wallet.walletType !== connectedWallet.walletType &&
                connectedWallet.selected
            );
            const walletNotSelected = !!wallets.find(
              (wallet) =>
                wallet.chain === connectedWallet.chain &&
                wallet.walletType === connectedWallet.walletType &&
                !connectedWallet.selected
            );
            if (walletSelected) {
              return { ...connectedWallet, selected: false };
            } else if (walletNotSelected) {
              return { ...connectedWallet, selected: true };
            }

            return connectedWallet;
          }),
        })),
      clearConnectedWallet: () =>
        set(() => ({
          connectedWallets: [],
          selectedWallets: [],
        })),
      getWalletsDetails: async (accounts, findToken, shouldRetry = true) => {
        const getWalletsDetails = get().getWalletsDetails;
        set((state) => ({
          loading: true,
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
            set((state) => {
              const connectedWallets = state.connectedWallets.map(
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
                    getWalletsDetails([matchedAccount], findToken, false);
                  }
                  return matchedAccount && retrievedBalanceAccount
                    ? {
                        ...connectedWallet,
                        explorerUrl: retrievedBalanceAccount.explorerUrl,
                        balances: makeBalanceFor(
                          retrievedBalanceAccount,
                          findToken
                        ),
                        loading: false,
                      }
                    : connectedWallet;
                }
              );

              const balances = makeTokensBalance(connectedWallets);

              return {
                loading: false,
                balances,
                connectedWallets,
              };
            });
          } else {
            throw new Error('Wallet not found');
          }
        } catch (error) {
          set((state) => {
            const connectedWallets = state.connectedWallets.map((balance) => {
              return accounts.find((account) =>
                isAccountAndWalletMatched(account, balance)
              )
                ? resetConnectedWalletState(balance)
                : balance;
            });

            const balances = makeTokensBalance(connectedWallets);

            return {
              loading: false,
              balances,
              connectedWallets,
            };
          });
        }
      },
      getBalanceFor: (token) => {
        const { balances } = get();
        const tokenHash = createTokenHash(token);
        const balance = balances[tokenHash];
        return balance ?? null;
      },
    }))
  )
);
