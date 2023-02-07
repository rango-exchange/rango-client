import { readAccountAddress } from '@rangodev/wallets-core';
import { isEvmAddress, Network } from '@rangodev/wallets-shared';
import BigNumber from 'bignumber.js';
import { WalletDetail, WalletDetailsResponse } from 'rango-sdk';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { httpService } from '../services/httpService';

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

export interface AccountWithBalance {
  balances: WalletBalance[] | null;
  address: string;
  loading: boolean;
  walletType: WalletType;
  error: boolean;
  explorerUrl: string | null;
  isConnected: boolean;
}

export interface Balance {
  blockchain: string;
  accountsWithBalance: AccountWithBalance[];
}

interface WalletsStore {
  accounts: Account[];
  balance: Balance[];
  insertAccount: (balance: Balance[]) => void;
  insertBalance: (wallets: WalletDetail[], walletType: string) => void;
  disconnectWallet: (walletType: WalletType) => void;
}

export const useWalletsStore = create<WalletsStore>()(
  immer((set) => ({
    accounts: [],
    balance: [],
    insertAccount: (accounts) =>
      set((state) => {
        accounts.forEach((account) => {
          const blockchainAccount = state.accounts?.find(
            (acc) => acc.blockchain === account.blockchain,
          );
          if (!!blockchainAccount) {
            console.log(blockchainAccount);
            blockchainAccount?.accounts.push({
              address: account.accountsWithBalance[0].address,
              walletType: account.accountsWithBalance[0].walletType,
            });
          } else {
            state.accounts = state.accounts.concat([
              {
                blockchain: account.blockchain,
                accounts: [
                  {
                    address: account.accountsWithBalance[0].address,
                    walletType: account.accountsWithBalance[0].walletType,
                  },
                ],
              },
            ]);
          }

          const blockchainBalance = state.balance?.find(
            (balance) => balance.blockchain === account.blockchain,
          );

          if (!!blockchainBalance)
            blockchainBalance.accountsWithBalance.push(account.accountsWithBalance[0]);
          else state.balance?.push(account);
        });
      }),
    insertBalance: (wallets, walletType) =>
      set((state) => {
        wallets.forEach((wallet) => {
          const a = state.balance.find((b) => b.blockchain === wallet.blockChain)!;
          const b = a?.accountsWithBalance.find((acc) => acc.walletType === walletType)!;
          b.address = wallet.address;
          b.error = wallet.failed;
          b.explorerUrl = wallet.explorerUrl;
          b.isConnected = true;
          b.loading = false;
          b.balances =
            wallet.balances?.map((b) => ({
              chain: wallet.blockChain,
              symbol: b.asset.symbol,
              ticker: b.asset.symbol,
              address: b.asset.address || null,
              rawAmount: b.amount.amount,
              decimal: b.amount.decimals,
              amount: new BigNumber(b.amount.amount).shiftedBy(-b.amount.decimals).toFixed(),
              logo: '',
              usdPrice: null,
            })) || [];
          b.walletType = walletType;
        });
      }),
    disconnectWallet: () => set(() => {}),
  })),
);
