import type { AppStoreState } from './types';
import type { Token } from 'rango-sdk';
import type { StateCreator } from 'zustand';

import BigNumber from 'bignumber.js';

import { eventEmitter } from '../../services/eventEmitter';
import { httpService } from '../../services/httpService';
import {
  type Balance,
  type Wallet,
  WalletEventTypes,
  WidgetEvents,
} from '../../types';
import { isAccountAndWalletMatched } from '../../utils/wallets';
import {
  createBalanceKey,
  createBalanceStateForNewAccount,
} from '../utils/wallets';

type WalletAddress = string;
type TokenAddress = string;
type BlockchainId = string;
/** `walletAddress-Blockchain-tokenAddress` */
export type BalanceKey = `${BlockchainId}-${TokenAddress}-${WalletAddress}`;
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
  _balances: BalanceState;
  connectedWallets: ConnectedWallet[];
  fetchingWallets: boolean;

  setConnectedWalletAsRefetching: (walletType: string) => void;
  setConnectedWalletHasError: (walletType: string) => void;
  setConnectedWalletRetrievedData: (walletType: string) => void;
  addConnectedWallet: (accounts: Wallet[]) => void;
  setWalletsAsSelected: (
    wallets: { walletType: string; chain: string }[]
  ) => void;
  /**
   * Add new accounts to store and fetch balances for them.
   */
  newWalletConnected: (accounts: Wallet[]) => Promise<void>;
  disconnectWallet: (walletType: string) => void;
  clearConnectedWallet: () => void;
  fetchBalances: (accounts: Wallet[]) => Promise<void>;
  getBalanceFor: (token: Token) => Balance | null;
  getBalances: () => BalanceState;
}

export const createWalletsSlice: StateCreator<
  AppStoreState,
  [],
  [],
  WalletsSlice
> = (set, get) => ({
  _balances: {},
  connectedWallets: [],
  fetchingWallets: false,

  // Actions
  setConnectedWalletAsRefetching: (walletType: string) => {
    set((state) => {
      return {
        fetchingWallets: true,
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
  setConnectedWalletRetrievedData: (walletType: string) => {
    set((state) => {
      return {
        fetchingWallets: false,
        connectedWallets: state.connectedWallets.map((connectedWallet) => {
          if (connectedWallet.walletType === walletType) {
            return {
              ...connectedWallet,
              loading: false,
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
        fetchingWallets: false,
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
  addConnectedWallet: (accounts: Wallet[]) => {
    /*
     * When we are going to add a new account, there are two thing that can be haapens:
     * 1. Wallet hasn't add yet.
     * 2. Wallet has added, and there are some more account that needs to added to connected wallet. consider we've added an ETH and Pol account, then we need to add Arb account later as well.
     *
     * For handling this, we need to only keep not added account, then only add those.
     */
    const connectedWallets = get().connectedWallets;
    const walletsNeedToBeAdded = accounts.filter(
      (account) =>
        !connectedWallets.some((connectedWallet) =>
          isAccountAndWalletMatched(account, connectedWallet)
        )
    );

    if (walletsNeedToBeAdded.length > 0) {
      const newConnectedWallets = walletsNeedToBeAdded.map((account) => {
        return {
          address: account.address,
          chain: account.chain,
          explorerUrl: null,
          walletType: account.walletType,
          selected: false,

          loading: false,
          error: false,
        };
      });

      set((state) => {
        return {
          connectedWallets: [...state.connectedWallets, ...newConnectedWallets],
        };
      });
    }
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

    get().addConnectedWallet(accounts);

    void get().fetchBalances(accounts);
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
  clearConnectedWallet: () => set({ connectedWallets: [] }),
  fetchBalances: async (accounts) => {
    // All the `accounts` have same `walletType` so we can pick the first one.
    const walletType = accounts[0].walletType;

    get().setConnectedWalletAsRefetching(walletType);

    const addressesToFetch = accounts.map((account) => ({
      address: account.address,
      blockchain: account.chain,
    }));
    const response = await httpService().getWalletsDetails(addressesToFetch);

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

      console.log({ nextBalances, aaa: get().connectedWallets });

      set((state) => ({
        _balances: {
          ...state._balances,
          ...nextBalances,
        },
      }));

      get().setConnectedWalletRetrievedData(walletType);
    } else {
      get().setConnectedWalletHasError(walletType);
      throw new Error(
        `We couldn't fetch your account balances. Seem there is no information on blockchain for them yet.`
      );
    }
  },
  getBalances: () => {
    /**
     * NOTE:
     * We are iterating over connected wallets and make a list from address
     * we need that because `balances` currently don't have a clean up mechanism
     * which means if a wallet disconnect, balances are exists in store and only the wallet will be removed from `connectedWallets`.
     *
     * If we introduce a cleanup feature in future, we can remove this and only iterating over balances would be enough.
     */

    const addresses = get().connectedWallets.map(
      (connectedWallet) => connectedWallet.address
    );

    const handler = {
      ownKeys(target: BalanceState) {
        const keys: BalanceKey[] = [];

        for (const balanceKey of Object.keys(target)) {
          if (addresses.find((address) => balanceKey.endsWith(address))) {
            keys.push(balanceKey as BalanceKey);
          }
        }

        return keys;
      },
    };

    return new Proxy(get()._balances, handler);
  },
  getBalanceFor: (token) => {
    const balances = get().getBalances();

    /*
     * The old implementation wasn't considering user's address.
     * it can be problematic when two separate address has same token, both of them will override on same key.
     *
     * For keeping the same behavior, here we pick the most amount and also will not consider user's address in key.
     */

    const key = createBalanceKey('unknown', token);
    const keyParts = key.split('-');
    keyParts.pop();
    const keyWithoutAccountAddress = keyParts.join('-');
    // console.log({ keyWithoutAccountAddress, balances });

    const targetBalanceKeys: BalanceKey[] = [];
    for (const balanceKey of Object.keys(balances)) {
      if (balanceKey.startsWith(keyWithoutAccountAddress)) {
        targetBalanceKeys.push(balanceKey as BalanceKey);
      }
    }

    if (targetBalanceKeys.length === 0) {
      return null;
    } else if (targetBalanceKeys.length === 1) {
      const targetKey = targetBalanceKeys[0];
      return balances[targetKey];
    }

    // If there are multiple balances for an specific token, we pick the maximum.
    const firstTargetBalance = balances[targetBalanceKeys[0]];
    let maxBalance: Balance = firstTargetBalance;
    targetBalanceKeys.forEach((targetBalanceKey) => {
      const currentBalance = balances[targetBalanceKey];
      const currentBalanceAmount = new BigNumber(currentBalance.amount);
      const prevBalanceAmount = new BigNumber(maxBalance.amount);

      if (currentBalanceAmount.isGreaterThan(prevBalanceAmount)) {
        maxBalance = currentBalance;
      }
    });

    return maxBalance;
  },
});
