import { WalletType } from '@rangodev/wallets-shared';
import BigNumber from 'bignumber.js';
import { Token, WalletDetail } from 'rango-sdk';
import { create } from 'zustand';
import { SelectableWallet } from '../pages/ConfirmWalletsPage';
import { getRequiredChains, SelectedWallet, getUsdPrice } from '../utils/wallets';
import { useBestRouteStore } from './bestRoute';
import createSelectors from './selectors';

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
  insertAccount: (balance: Balance[]) => void;
  insertBalance: (wallets: WalletDetail[], walletType: WalletType, tokens: Token[]) => void;
  disconnectWallet: (walletType: WalletType) => void;
  initSelectedWallets: () => void;
  setSelectedWallet: (wallet: SelectableWallet) => void;
}

export const useWalletsStore = createSelectors(
  create<WalletsStore>()((set, get) => ({
    accounts: [],
    balances: [],
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
              usdPrice: getUsdPrice(
                wallet.blockChain,
                retrivedWallet.asset.symbol,
                retrivedWallet.asset.address,
                tokens,
              ),
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
        const connectedWallets = state.accounts;
        const selectedWallets: SelectedWallet[] = [];
        requiredChains.forEach((chain) => {
          const anyWalletSelected = !!state.selectedWallets.find(
            (wallet) => wallet.chain === chain,
          );
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
  })),
);
