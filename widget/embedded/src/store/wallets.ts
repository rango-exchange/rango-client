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
  selectedWallets: SelectedWallet[];
  insertAccount: (balance: Balance[]) => void;
  insertBalance: (wallets: WalletDetail[], walletType: WalletType, token?: any) => void;
  disconnectWallet: (walletType: WalletType) => void;
  initSelectedWallets: () => void;
  setSelectedWallet: (wallet: SelectableWallet) => void;
}

export const useWalletsStore = create<WalletsStore>()(
  immer((set) => ({
    accounts: [],
    balance: [],
    selectedWallets: [],
    insertAccount: (accounts) =>
      set((state) => {
        accounts.forEach((account) => {
          const blockchainAccount = state.accounts?.find(
            (acc) => acc.blockchain === account.blockchain,
          );
          if (!!blockchainAccount) {
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
    insertBalance: (wallets, walletType, tokens) =>
      set((state) => {
        wallets.forEach((wallet) => {
          const walletsWithSameBlockchain = state.balance.find(
            (acc) => acc.blockchain === wallet.blockChain,
          )!;
          const retrivedWallet = walletsWithSameBlockchain?.accountsWithBalance.find(
            (acc) => acc.walletType === walletType,
          )!;
          retrivedWallet.address = wallet.address;
          retrivedWallet.error = wallet.failed;
          retrivedWallet.explorerUrl = wallet.explorerUrl;
          retrivedWallet.isConnected = true;
          retrivedWallet.loading = false;
          retrivedWallet.balances =
            wallet.balances?.map((retrivedWallet) => ({
              chain: wallet.blockChain,
              symbol: retrivedWallet.asset.symbol,
              ticker: retrivedWallet.asset.symbol,
              address: retrivedWallet.asset.address || null,
              rawAmount: retrivedWallet.amount.amount,
              decimal: retrivedWallet.amount.decimals,
              amount: new BigNumber(retrivedWallet.amount.amount)
                .shiftedBy(-retrivedWallet.amount.decimals)
                .toFixed(),
              logo: '',
              usdPrice:
                tokens?.find((i: any) => i.symbol === retrivedWallet.asset.symbol)?.usdPrice ||
                null,
            })) || [];
          retrivedWallet.walletType = walletType;
        });
      }),
    disconnectWallet: (walletType) =>
      set(() => {
        //
      }),
    initSelectedWallets: () =>
      set((state) => {
        const requiredChains = getRequiredChains(useBestRouteStore.getState().bestRoute);
        const connectedWallets: SelectedWallet[] = [];
        const selectedWallets: SelectedWallet[] = [];
        state.accounts.forEach((account) => {
          account.accounts.forEach((acc) => {
            connectedWallets.push({
              address: acc.address,
              walletType: acc.walletType,
              blockchain: account.blockchain,
            });
          });
        });
        requiredChains.forEach((chain) => {
          const firstWalletWithMatchedChain = connectedWallets.find(
            (wallet) => wallet.blockchain === chain,
          );
          if (!!firstWalletWithMatchedChain)
            selectedWallets.push({
              address: firstWalletWithMatchedChain.address,
              blockchain: firstWalletWithMatchedChain.blockchain,
              walletType: firstWalletWithMatchedChain.walletType,
            });
        });
        state.selectedWallets.push(...selectedWallets);
      }),
    setSelectedWallet: (wallet) =>
      set((state) => {
        state.selectedWallets.splice(
          state.selectedWallets.findIndex((w) => wallet.blockchain === w.blockchain),
          1,
          { blockchain: wallet.blockchain, address: wallet.address, walletType: wallet.walletType },
        );
      }),
  })),
);
