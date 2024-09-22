import type { AppStoreState } from './types';
import type { RangoClient } from 'rango-sdk';
import type { StateCreator } from 'zustand';

import { eventEmitter } from '../../services/eventEmitter';
import { httpService } from '../../services/httpService';
import {
  type Balance,
  type Wallet,
  WalletEventTypes,
  WidgetEvents,
} from '../../types';
import { createBalanceStateForNewAccount } from '../utils/wallets';

type WalletAddress = string;
type TokenAddress = string;
type BlockchainId = string;
/** `walletAddress-Blockchain-tokenAddress` */
export type BalanceKey = `${WalletAddress}-${BlockchainId}-${TokenAddress}`;
export type BalanceState = {
  [key: BalanceKey]: Balance;
};

export interface ConnectedWallet extends Wallet {
  explorerUrl: string | null;
  selected: boolean;
  loading: boolean;
  error: boolean;
}

export interface WalletsSlice {
  balances: BalanceState;
  connectedWallets: ConnectedWallet[];
  loading: boolean;

  setConnectedWalletAsRefetching: (walletType: string) => void;
  setConnectedWalletHasError: (walletType: string) => void;
  setNewConnectedWalletAsLoading: (accounts: Wallet[]) => void;
  setWalletsAsSelected: (
    wallets: { walletType: string; chain: string }[]
  ) => void;
  /**
   * Add new accounts to store and fetch balances for them.
   */
  newWalletConnected: (accounts: Wallet[]) => Promise<void>;
  disconnectWallet: (walletType: string) => void;
  fetchBalances: (
    walletAddresses: Parameters<RangoClient['getWalletsDetails']>[0],
    options?: Parameters<RangoClient['getWalletsDetails']>[1]
  ) => Promise<void>;
}

export const createWalletsSlice: StateCreator<
  AppStoreState,
  [],
  [],
  WalletsSlice
> = (set, get) => ({
  balances: {},
  connectedWallets: [],
  loading: false,

  // Actions
  fetchBalances: async (walletAddresses, options) => {
    const response = await httpService().getWalletsDetails(
      walletAddresses,
      options
    );

    const listWalletsWithBalances = response.wallets;
    if (listWalletsWithBalances) {
      let nextBalances: BalanceState = {};
      listWalletsWithBalances.forEach((wallet) => {
        const balancesForWallet = createBalanceStateForNewAccount(wallet, get);

        nextBalances = {
          ...nextBalances,
          ...balancesForWallet,
        };
      });

      set({
        balances: {
          ...get().balances,
          ...nextBalances,
        },
      });
    } else {
      throw new Error(
        `We couldn't fetch your account balances. Seem there is no information on blockchain for them yet.`
      );
    }
  },
  setConnectedWalletAsRefetching: (walletType: string) => {
    set((state) => {
      return {
        loading: true,
        connectedWallets: state.connectedWallets.map((connectedWallet) => {
          if (connectedWallet.walletType === walletType) {
            return {
              ...connectedWallet,
              loading: true,
              error: false,
            };
          }

          return connectedWallet;
        }),
      };
    });
  },
  setConnectedWalletHasError: (walletType: string) => {
    set((state) => {
      return {
        loading: false,
        connectedWallets: state.connectedWallets.map((connectedWallet) => {
          if (connectedWallet.walletType === walletType) {
            return {
              ...connectedWallet,
              loading: false,
              error: true,
            };
          }

          return connectedWallet;
        }),
      };
    });
  },
  setNewConnectedWalletAsLoading: (accounts: Wallet[]) => {
    set((state) => {
      const newConnectedWallets = accounts.map((account) => {
        return {
          address: account.address,
          chain: account.chain,
          explorerUrl: null,
          walletType: account.walletType,
          selected: false,

          loading: true,
          error: false,
        };
      });
      return {
        loading: true,
        connectedWallets: [...state.connectedWallets, ...newConnectedWallets],
      };
    });
  },
  setWalletsAsSelected: (wallets) => {
    const nextConnectedWalletsWithUpdatedSelectedStatus =
      get().connectedWallets.map((connectedWallet) => {
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
      });

    set({
      connectedWallets: nextConnectedWalletsWithUpdatedSelectedStatus,
    });
  },
  newWalletConnected: async (accounts) => {
    eventEmitter.emit(WidgetEvents.WalletEvent, {
      type: WalletEventTypes.CONNECT,
      payload: { walletType: accounts[0].walletType, accounts },
    });

    // All the `accounts` have same `walletType` so we can pick the first one.
    const walletType = accounts[0].walletType;
    const isWalletConnectedBefore = get().connectedWallets.find(
      (connectedWallet) => connectedWallet.walletType === walletType
    );

    if (isWalletConnectedBefore) {
      get().setConnectedWalletAsRefetching(walletType);
    } else {
      get().setNewConnectedWalletAsLoading(accounts);
    }

    const addressesToFetch = accounts.map((account) => ({
      address: account.address,
      blockchain: account.chain,
    }));

    get()
      .fetchBalances(addressesToFetch)
      .catch(() => {
        get().setConnectedWalletHasError(walletType);
      });
  },
  disconnectWallet: (walletType) => {
    const isTargetWalletExistsInConnectedWallets = get().connectedWallets.find(
      (wallet) => wallet.walletType === walletType
    );
    if (isTargetWalletExistsInConnectedWallets) {
      eventEmitter.emit(WidgetEvents.WalletEvent, {
        type: WalletEventTypes.DISCONNECT,
        payload: { walletType },
      });

      let targetWalletWasSelectedForBlockchains = get()
        .connectedWallets.filter(
          (connectedWallet) =>
            connectedWallet.selected &&
            connectedWallet.walletType !== walletType
        )
        .map((connectedWallet) => connectedWallet.chain);

      // Remove target wallet from connectedWallets
      let nextConnectedWallets = get().connectedWallets.filter(
        (connectedWallet) => connectedWallet.walletType !== walletType
      );

      /*
       * If we are disconnecting a wallet that has `selected` for some blockchains,
       * For those blockchains we will fallback to first connected wallet
       * which means selected wallet will change.
       */
      if (targetWalletWasSelectedForBlockchains.length > 0) {
        nextConnectedWallets = nextConnectedWallets.map((connectedWallet) => {
          if (
            targetWalletWasSelectedForBlockchains.includes(
              connectedWallet.chain
            )
          ) {
            targetWalletWasSelectedForBlockchains =
              targetWalletWasSelectedForBlockchains.filter(
                (blockchain) => blockchain !== connectedWallet.chain
              );
            return {
              ...connectedWallet,
              selected: true,
            };
          }

          return connectedWallet;
        });
      }

      set({
        connectedWallets: nextConnectedWallets,
      });
    }
  },
});
