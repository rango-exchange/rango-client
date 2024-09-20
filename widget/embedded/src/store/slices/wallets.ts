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
  createAssetKey,
  createBalanceKey,
  createBalanceStateForNewAccount,
  extractAssetFromBalanceKey,
  removeBalanceFromAggregatedBalance,
  updateAggregatedBalanceStateForNewAccount,
} from '../utils/wallets';

type WalletAddress = string;
type TokenAddress = string;
type TokenSymbol = string;
type BlockchainId = string;
/** format: `BlockchainId-TokenAddress-TokenSymbol` */
export type AssetKey = `${BlockchainId}-${TokenAddress}-${TokenSymbol}`;
/** format: `BlockchainId-TokenAddress-TokenSymbol-WalletAddress` */
export type BalanceKey =
  `${BlockchainId}-${TokenAddress}-${TokenSymbol}-${WalletAddress}`;

export type BalanceState = {
  [key: BalanceKey]: Balance;
};
export type AggregatedBalanceState = {
  [key: AssetKey]: BalanceKey[];
};

export interface ConnectedWallet extends Wallet {
  explorerUrl: string | null;
  selected: boolean;
  loading: boolean;
  error: boolean;
}

export interface WalletsSlice {
  _balances: BalanceState;
  _aggregatedBalances: AggregatedBalanceState;
  connectedWallets: ConnectedWallet[];
  fetchingWallets: boolean;

  setConnectedWalletAsRefetching: (walletType: string) => void;
  setConnectedWalletHasError: (walletType: string) => void;
  setConnectedWalletRetrievedData: (walletType: string) => void;
  removeBalancesForWallet: (walletType: string) => void;
  addConnectedWallet: (accounts: Wallet[]) => void;
  setWalletsAsSelected: (
    wallets: { walletType: string; chain: string }[]
  ) => void;
  /**
   * Add new accounts to store and fetch balances for them.
   */
  newWalletConnected: (accounts: Wallet[]) => Promise<void>;
  /**
   * Disconnect a wallet and clean up balances after that.
   */
  disconnectWallet: (walletType: string) => void;
  clearConnectedWallet: () => void;
  fetchBalances: (
    accounts: Wallet[],
    options?: { retryOnFailedBalances?: boolean }
  ) => Promise<void>;
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
  _aggregatedBalances: {},
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
     * When we are going to add a new account, there are two thing that can be happens:
     * 1. Wallet hasn't add yet.
     * 2. Wallet has added, and there are some more account that needs to added to connected wallet. consider we've added an ETH and Pol account, then we need to add Arb account later as well.
     *
     * For handling this, we need to only keep not-added-account, then only add those.
     *
     * Note:
     * The second option would be useful for hub particularly.
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
        /*
         * When a wallet is connecting, we will check if there is any `selected` wallet before, if not, we will consider this new wallet as connected.
         * In this way, when user tries to swap, we selected a wallet by default and don't need to do an extra click in ConfirmWalletModal
         */
        const shouldMarkWalletAsSelected = !connectedWallets.some(
          (connectedWallet) =>
            connectedWallet.chain === account.chain &&
            connectedWallet.selected &&
            /**
             * Sometimes, the connect function can be called multiple times for a particular wallet type when using the auto-connect feature.
             * This check is there to make sure the chosen wallet doesn't end up unselected.
             */
            connectedWallet.walletType !== account.walletType
        );

        return {
          address: account.address,
          chain: account.chain,
          explorerUrl: null,
          walletType: account.walletType,
          selected: shouldMarkWalletAsSelected,

          loading: false,
          error: false,
        };
      });

      set((state) => {
        /*
         * If wallet connected before and only need to update the address we should remove the old value and then add new conncted value.
         * This scenario happens when user wants to change account inside the wallet.
         * So the assumption here is the wallet has only one active address for a blockchain at the moment.
         */
        const connectedWalletsWithoutSameWalletAndBlockchain =
          state.connectedWallets.filter((currentConnectedWallet) => {
            return !newConnectedWallets.some(
              (newConnectedWallet) =>
                newConnectedWallet.walletType ===
                  currentConnectedWallet.walletType &&
                newConnectedWallet.chain === currentConnectedWallet.chain
            );
          });

        return {
          connectedWallets: [
            ...connectedWalletsWithoutSameWalletAndBlockchain,
            ...newConnectedWallets,
          ],
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
  removeBalancesForWallet: (walletType) => {
    let walletsNeedsToBeRemoved = get().connectedWallets.filter(
      (connectedWallet) => connectedWallet.walletType === walletType
    );
    /*
     * We only need to delete balances where there is no connected wallets with same chain and address for that balance.
     * Consider both Metamask and Solana having support for `0xblahblahblahblah` for Ethereum.
     * If Phantom is disconnecting, we should keep the balance since Metamask has access to same address yet.
     * So we only delete balance when there is no connected wallet that has access to that specific chain and address.
     */
    get().connectedWallets.forEach((connectedWallet) => {
      if (connectedWallet.walletType !== walletType) {
        walletsNeedsToBeRemoved = walletsNeedsToBeRemoved.filter((wallet) => {
          const isAnotherWalletHasSameAddressAndChain =
            wallet.chain === connectedWallet.chain &&
            wallet.address === connectedWallet.address;
          return !isAnotherWalletHasSameAddressAndChain;
        });
      }
    });

    const nextBalancesState: BalanceState = {};
    let nextAggregatedBalanceState: AggregatedBalanceState =
      get()._aggregatedBalances;
    const currentBalancesState = get()._balances;
    const balanceKeys = Object.keys(currentBalancesState) as BalanceKey[];

    balanceKeys.forEach((key) => {
      const asset = extractAssetFromBalanceKey(key);

      const shouldBalanceBeRemoved = !!walletsNeedsToBeRemoved.find(
        (wallet) =>
          createBalanceKey(wallet.address, {
            address: asset.address,
            blockchain: wallet.chain,
            symbol: asset.symbol,
          }) === key
      );

      if (!shouldBalanceBeRemoved) {
        nextBalancesState[key] = currentBalancesState[key];
      }

      // if a balance should be removed, we need to remove its caches in _aggregatedBalances as wel.
      if (shouldBalanceBeRemoved) {
        nextAggregatedBalanceState = removeBalanceFromAggregatedBalance(
          nextAggregatedBalanceState,
          key
        );
      }
    });
    set({
      _balances: nextBalancesState,
      _aggregatedBalances: nextAggregatedBalanceState,
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

      // This should be called before updating connectedWallets since we need the old state to remove balances.
      get().removeBalancesForWallet(walletType);

      let targetWalletWasSelectedForBlockchains = get()
        .connectedWallets.filter(
          (connectedWallet) =>
            connectedWallet.selected &&
            connectedWallet.walletType === walletType
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
  fetchBalances: async (accounts, options) => {
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
      const { retryOnFailedBalances = true } = options || {};
      if (retryOnFailedBalances) {
        const failedWallets: Wallet[] = listWalletsWithBalances
          .filter((wallet) => wallet.failed)
          .map((wallet) => ({
            chain: wallet.blockChain,
            walletType: walletType,
            address: wallet.address,
          }));
        if (failedWallets.length > 0) {
          void get().fetchBalances(failedWallets, {
            retryOnFailedBalances: false,
          });
        }
      }

      let nextBalances: BalanceState = {};
      let nextAggregatedBalances: AggregatedBalanceState =
        get()._aggregatedBalances;
      listWalletsWithBalances.forEach((wallet) => {
        if (wallet.failed) {
          return;
        }

        const balancesForWallet = createBalanceStateForNewAccount(wallet, get);

        nextAggregatedBalances = updateAggregatedBalanceStateForNewAccount(
          nextAggregatedBalances,
          balancesForWallet
        );

        nextBalances = {
          ...nextBalances,
          ...balancesForWallet,
        };
      });

      set((state) => ({
        _balances: {
          ...state._balances,
          ...nextBalances,
        },
        _aggregatedBalances: nextAggregatedBalances,
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
    return get()._balances;
  },
  getBalanceFor: (token) => {
    const balances = get().getBalances();

    /*
     * The old implementation wasn't considering user's address.
     * it can be problematic when two separate address has same token, both of them will override on same key.
     *
     * For keeping the same behavior, here we pick the most amount and also will not consider user's address in key.
     */

    // Note: balance key is created using asset key + wallet address
    const assetKey = createAssetKey(token);
    const targetBalanceKeys = get()._aggregatedBalances[assetKey] || [];

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
