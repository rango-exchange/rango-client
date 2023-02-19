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
  insertBalance: (wallets: WalletDetail[], walletType: string) => void;
  disconnectWallet: (walletType: WalletType) => void;
  initSelectedWallets: () => void;
  setSelectedWallet: (wallet: SelectableWallet) => void;
}

export const useWalletsStore = create<WalletsStore>()(
  immer((set) => ({
    accounts: [] as any,
    balance: [] as any,
    selectedWallets: [] as any,
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
          b.walletType = walletType as any;
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
