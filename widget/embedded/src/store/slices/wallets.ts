import type { AppStoreState } from './types';
import type { WalletType } from '@rango-dev/wallets-shared';
import type { Token } from 'rango-sdk';
import type { StateCreator } from 'zustand';

import BigNumber from 'bignumber.js';

import { ZERO } from '../../constants/numbers';
import { eventEmitter } from '../../services/eventEmitter';
import { httpService } from '../../services/httpService';
import {
  type Balance,
  type Wallet,
  WalletEventTypes,
  WidgetEvents,
} from '../../types';
import { isBalanceKeyAndWalletMatched } from '../../utils/wallets';
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

interface DeprecatedTokenBalance {
  chain: string;
  symbol: string;
  ticker: string;
  address: string | null;
  rawAmount: string;
  decimal: number | null;
  amount: string;
  logo: string | null;
  usdPrice: number | null;
}

export interface DeprecatedWalletDetail extends ConnectedWallet {
  balances: DeprecatedTokenBalance[] | null;
}

export interface WalletsSlice {
  _balances: BalanceState;
  _aggregatedBalances: AggregatedBalanceState;
  connectedWallets: ConnectedWallet[];
  fetchingWallets: boolean;

  setConnectedWalletAsRefetching: (walletType: string) => void;
  setConnectedWalletHasError: (walletType: string) => void;
  setConnectedWalletRetrievedData: (walletType: string) => void;
  setWalletsAsSelected: (
    wallets: { walletType: string; chain: string }[]
  ) => void;
  /**
   * Update wallet accounts and balances.
   */
  updateWalletAccounts: (
    walletType: WalletType,
    accounts: Wallet[]
  ) => Promise<void>;
  /**
   * Fetch balance for new connected accounts and remove balance for old accounts
   */
  updateBalances: (walletType: WalletType, accounts: Wallet[]) => Promise<void>;
  /**
   * Fetch balance for new connected accounts and remove balance for old accounts
   */
  removeBalances: (balanceKeys: BalanceKey[]) => void;
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
  getBalancesForWalletAddress: (address: string) => BalanceState;

  /**
   * @deprecated
   * This is been added for backward compatibilty for WidgetInfo
   */
  getConnectedWalletsDetails: () => DeprecatedWalletDetail[];
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
  updateWalletAccounts: async (walletType, accounts) => {
    eventEmitter.emit(WidgetEvents.WalletEvent, {
      type: WalletEventTypes.CONNECT,
      payload: { walletType: accounts[0].walletType, accounts },
    });
    const connectedWallets = get().connectedWallets;

    const otherConnectedWallets = connectedWallets.filter(
      (wallet) => wallet.walletType !== walletType
    );

    const newConnectedWallets = accounts.map((account) => {
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

    void get().updateBalances(walletType, accounts);

    set(() => ({
      connectedWallets: [...otherConnectedWallets, ...newConnectedWallets],
    }));
  },
  updateBalances: async (walletType, accounts) => {
    // Get wallets which should be removed (have same wallet type and not included in new accounts)
    let walletsNeedToBeRemoved = get().connectedWallets.filter(
      (connectedWallet) =>
        connectedWallet.walletType === walletType &&
        !accounts.some(
          (account) =>
            account.address === connectedWallet.address &&
            account.chain === connectedWallet.chain
        )
    );

    /*
     * We only need to remove balances where there is no connected wallets with the same chain and address related to that balance.
     * Consider both Metamask and Solana support `0xblahblahblahblah` address for Ethereum.
     * If Phantom is disconnecting, we should keep the balance since Metamask has access to same address yet.
     * So we should remove balances only if there is no connected wallet to that specific chain and address.
     */

    get().connectedWallets.forEach((connectedWallet) => {
      if (connectedWallet.walletType !== walletType) {
        walletsNeedToBeRemoved = walletsNeedToBeRemoved.filter((wallet) => {
          const isAnotherWalletHasSameAddressAndChain =
            wallet.chain === connectedWallet.chain &&
            wallet.address === connectedWallet.address;
          return !isAnotherWalletHasSameAddressAndChain;
        });
      }
    });

    // Remove balance related to wallets which should be removed
    const balancesState = get()._balances;
    const balanceKeys = Object.keys(balancesState) as BalanceKey[];
    const shouldRemoveBalanceKeys: BalanceKey[] = [];

    walletsNeedToBeRemoved.forEach((wallet) => {
      const balanceKeysRelatedToWallet = balanceKeys.filter((balanceKey) =>
        isBalanceKeyAndWalletMatched(balanceKey, wallet)
      );
      shouldRemoveBalanceKeys.push(...balanceKeysRelatedToWallet);
    });

    if (shouldRemoveBalanceKeys.length) {
      void get().removeBalances(shouldRemoveBalanceKeys);
    }
    // Fetch balance for wallets which not exist currently
    const shouldFetchAccounts = accounts.filter(
      (account) =>
        !balanceKeys.find((key) => {
          const keyAsset = extractAssetFromBalanceKey(key);
          const walletKey = createBalanceKey(account.address, {
            address: keyAsset.address,
            blockchain: account.chain,
            symbol: keyAsset.symbol,
          });
          return walletKey === key;
        })
    );
    if (shouldFetchAccounts.length) {
      void get().fetchBalances(shouldFetchAccounts);
    }
  },
  removeBalances: async (balanceKeys) => {
    const nextBalancesState = get()._balances;
    let nextAggregatedBalanceState: AggregatedBalanceState =
      get()._aggregatedBalances;

    balanceKeys.forEach((balanceKey) => {
      delete nextBalancesState[balanceKey];
      nextAggregatedBalanceState = removeBalanceFromAggregatedBalance(
        nextAggregatedBalanceState,
        balanceKey
      );
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
      void get().updateBalances(walletType, []);

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
  getBalancesForWalletAddress: (address: string) => {
    const balances = get().getBalances();
    const balanceKeys = Object.keys(balances) as BalanceKey[];

    const balancesForTargetWalletAddress = balanceKeys.reduce(
      (output, balanceKey) => {
        const balance = balances[balanceKey];

        const [, , , balanceWalletAddreess] = balanceKey.split('-');
        if (balanceWalletAddreess === address) {
          output[balanceKey] = balance;
        }

        return output;
      },
      {} as BalanceState
    );

    return balancesForTargetWalletAddress;
  },

  getConnectedWalletsDetails: () => {
    const connectedWallets = get().connectedWallets;
    return connectedWallets.map((wallet) => {
      const balances = get().getBalancesForWalletAddress(wallet.address);
      const balancesKeys = Object.keys(balances) as BalanceKey[];

      return {
        ...wallet,
        balances: balancesKeys.reduce((output, balanceKey) => {
          const balance = balances[balanceKey];
          const asset = extractAssetFromBalanceKey(balanceKey);

          if (asset.blockchain === wallet.chain) {
            const token = get().findToken(asset);

            if (!!token) {
              const amount = balance.amount
                ? new BigNumber(balance.amount).shiftedBy(-balance.decimals)
                : ZERO;

              output.push({
                chain: wallet.chain,
                symbol: token.symbol,
                ticker: token.symbol,
                address: token.address,
                rawAmount: balance.amount,
                decimal: balance.decimals,
                amount: amount.toString(),
                logo: token.image,
                usdPrice: token.usdPrice,
              });
            } else {
              console.debug(
                "Looking for asset but it couldn't be found in tokens store. May not be provided in meta.'",
                asset
              );
            }
          }

          return output;
        }, [] as DeprecatedTokenBalance[]),
      };
    });
  },
});
