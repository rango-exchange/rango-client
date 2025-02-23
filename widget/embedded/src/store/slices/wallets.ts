import type { AppStoreState } from './types';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';
import type { Token, WalletDetail } from 'rango-sdk';

import BigNumber from 'bignumber.js';

import { ZERO } from '../../constants/numbers';
import { BALANCE_SEPARATOR } from '../../constants/wallets';
import { eventEmitter } from '../../services/eventEmitter';
import { httpService } from '../../services/httpService';
import {
  type Balance,
  type Wallet,
  WalletEventTypes,
  WidgetEvents,
} from '../../types';
import { memoizedResult } from '../../utils/common';
import { isAccountAndWalletMatched } from '../../utils/wallets';
import { keepLastUpdated } from '../middlewares/keepLastUpdated';
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
/** format: `BlockchainId${BALANCE_SEPARATOR}TokenAddress${BALANCE_SEPARATOR}TokenSymbol` */
export type AssetKey =
  `${BlockchainId}${typeof BALANCE_SEPARATOR}${TokenAddress}${typeof BALANCE_SEPARATOR}${TokenSymbol}`;
/** format: `BlockchainId${BALANCE_SEPARATOR}TokenAddress${BALANCE_SEPARATOR}TokenSymbol${BALANCE_SEPARATOR}WalletAddress` */
export type BalanceKey =
  `${BlockchainId}${typeof BALANCE_SEPARATOR}${TokenAddress}${typeof BALANCE_SEPARATOR}${TokenSymbol}${typeof BALANCE_SEPARATOR}${WalletAddress}`;

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
  namespace?: Namespace;
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

function matchWalletDetailsWithConnectedWallet(
  connectedWallet: ConnectedWallet,
  walletsDetails: WalletDetail[]
): WalletDetail | undefined {
  return walletsDetails.find(
    (walletDetails) =>
      connectedWallet.address === walletDetails.address &&
      connectedWallet.chain === walletDetails.blockChain
  );
}

export interface WalletsSlice {
  _balances: BalanceState;
  _aggregatedBalances: AggregatedBalanceState;
  connectedWallets: ConnectedWallet[];
  fetchingWallets: boolean;
  lastUpdatedAt: number;

  setConnectedWalletAsRefetching: (accounts: Wallet[]) => void;
  setConnectedWalletHasError: (accounts: Wallet[]) => void;
  setConnectedWalletRetrievedData: (
    accounts: Wallet[],
    walletsDetails: WalletDetail[]
  ) => void;
  removeBalancesForWallet: (
    walletType: string,
    options?: {
      chains?: string[];
      namespaces?: Namespace[];
    }
  ) => void;
  addConnectedWallet: (accounts: Wallet[], namespace?: Namespace) => void;
  setWalletsAsSelected: (
    wallets: { walletType: string; chain: string }[]
  ) => void;
  /**
   * Add new accounts to store and fetch balances for them.
   */
  newWalletConnected: (
    accounts: Wallet[],
    namespace?: Namespace
  ) => Promise<void>;
  disconnectNamespaces: (walletType: string, namespaces: Namespace[]) => void;
  /**
   * Disconnect a wallet and clean up balances after that.
   */
  disconnectWallet: (walletType: string) => void;
  _changeSelectedWalletIfNeededOnRemove: (
    walletType: string,
    options?: { namespaces?: Namespace[] }
  ) => void;
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

const memoizedConnectedWalletsWithNestedBalances = memoizedResult();
export const createWalletsSlice = keepLastUpdated<AppStoreState, WalletsSlice>(
  (set, get) => ({
    _balances: {},
    _aggregatedBalances: {},
    connectedWallets: [],
    fetchingWallets: false,
    lastUpdatedAt: +new Date(),

    // Actions
    setConnectedWalletAsRefetching: (accounts: Wallet[]) => {
      set((state) => {
        return {
          fetchingWallets: true,
          connectedWallets: state.connectedWallets.map((connectedWallet) => {
            if (
              accounts.find((account) =>
                isAccountAndWalletMatched(account, connectedWallet)
              )
            ) {
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
    setConnectedWalletRetrievedData: (
      accounts: Wallet[],
      walletsDetails: WalletDetail[]
    ) => {
      set((state) => {
        return {
          fetchingWallets: false,
          connectedWallets: state.connectedWallets.map((connectedWallet) => {
            if (
              accounts.find((account) =>
                isAccountAndWalletMatched(account, connectedWallet)
              )
            ) {
              return {
                ...connectedWallet,
                loading: false,
                error: false,
                explorerUrl:
                  matchWalletDetailsWithConnectedWallet(
                    connectedWallet,
                    walletsDetails
                  )?.explorerUrl || connectedWallet.explorerUrl,
              };
            }

            return connectedWallet;
          }),
        };
      });
    },
    setConnectedWalletHasError: (accounts: Wallet[]) => {
      set((state) => {
        return {
          fetchingWallets: false,
          connectedWallets: state.connectedWallets.map((connectedWallet) => {
            if (
              accounts.find((account) =>
                isAccountAndWalletMatched(account, connectedWallet)
              )
            ) {
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
    addConnectedWallet: (accounts, namespace) => {
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
        const newConnectedWallets: ConnectedWallet[] = walletsNeedToBeAdded.map(
          (account) => {
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
              namespace: namespace,
              loading: false,
              error: false,
            };
          }
        );

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
    newWalletConnected: async (accounts, namespace) => {
      eventEmitter.emit(WidgetEvents.WalletEvent, {
        type: WalletEventTypes.CONNECT,
        payload: { walletType: accounts[0].walletType, accounts },
      });

      get().addConnectedWallet(accounts, namespace);

      void get().fetchBalances(accounts);
    },
    removeBalancesForWallet: (walletType, options) => {
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

      if (!!options?.chains && options.chains.length > 0) {
        walletsNeedsToBeRemoved = walletsNeedsToBeRemoved.filter((wallet) => {
          return options.chains?.includes(wallet.chain);
        });
      }

      if (!!options?.namespaces && options.namespaces.length > 0) {
        walletsNeedsToBeRemoved = walletsNeedsToBeRemoved.filter((wallet) => {
          if (wallet.namespace) {
            return options.namespaces?.includes(wallet.namespace);
          }
          return false;
        });
      }

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

        // if a balance should be removed, we need to remove its caches in _aggregatedBalances as wel.
        if (shouldBalanceBeRemoved) {
          nextAggregatedBalanceState = removeBalanceFromAggregatedBalance(
            nextAggregatedBalanceState,
            key
          );
        } else {
          nextBalancesState[key] = currentBalancesState[key];
        }
      });

      set({
        _balances: nextBalancesState,
        _aggregatedBalances: nextAggregatedBalanceState,
      });
    },
    disconnectNamespaces: (walletType, requestedNamesapces) => {
      const isTargetWalletExistsInConnectedWallets =
        get().connectedWallets.find(
          (wallet) => wallet.walletType === walletType
        );

      if (isTargetWalletExistsInConnectedWallets) {
        // This should be called before updating connectedWallets since we need the old state to remove balances.
        get().removeBalancesForWallet(walletType, {
          namespaces: requestedNamesapces,
        });

        get()._changeSelectedWalletIfNeededOnRemove(walletType, {
          namespaces: requestedNamesapces,
        });

        const nextConnectedWallets = get().connectedWallets.filter(
          (connectedWallet) => {
            if (connectedWallet.namespace) {
              const targetWalletAndNamespace =
                connectedWallet.walletType === walletType &&
                requestedNamesapces.includes(connectedWallet.namespace);

              // If the wallet and namespace matched, we should filter it out.
              return !targetWalletAndNamespace;
            }
            /*
             * if a connected wallet hasn't `namesapce`, it means it legacy.
             * legacy will not reach this method, but for we check anyways
             */
            return true;
          }
        );

        set({
          connectedWallets: nextConnectedWallets,
        });
      }
    },
    disconnectWallet: (walletType) => {
      const isTargetWalletExistsInConnectedWallets =
        get().connectedWallets.find(
          (wallet) => wallet.walletType === walletType
        );
      /*
       * Previously DISCONNECT event was being emitted if target wallet existed in connected wallets.
       * Considering that connected wallets get clear on namespace disconnect in hub,
       * now emitting this event is done without checking for connected wallets to be compatible with hub.
       */
      eventEmitter.emit(WidgetEvents.WalletEvent, {
        type: WalletEventTypes.DISCONNECT,
        payload: { walletType },
      });
      if (isTargetWalletExistsInConnectedWallets) {
        // This should be called before updating connectedWallets since we need the old state to remove balances.
        get().removeBalancesForWallet(walletType);

        get()._changeSelectedWalletIfNeededOnRemove(walletType);

        // Remove target wallet from connectedWallets
        const nextConnectedWallets = get().connectedWallets.filter(
          (connectedWallet) => connectedWallet.walletType !== walletType
        );

        set({
          connectedWallets: nextConnectedWallets,
        });
      }
    },
    /*
     * If we are disconnecting a wallet that has `selected` for some blockchains,
     * For those blockchains we will fallback to first connected wallet
     * which means selected wallet will change.
     */
    _changeSelectedWalletIfNeededOnRemove: (walletType, options) => {
      let connectedWallets = get().connectedWallets;

      if (options?.namespaces && options.namespaces.length > 0) {
        connectedWallets = connectedWallets.filter(
          (connectedWallet) =>
            !!connectedWallet.namespace &&
            options.namespaces?.includes(connectedWallet.namespace)
        );
      }

      let targetWalletWasSelectedForBlockchains = connectedWallets
        .filter(
          (connectedWallet) =>
            connectedWallet.selected &&
            connectedWallet.walletType === walletType
        )
        .map((connectedWallet) => connectedWallet.chain);

      if (targetWalletWasSelectedForBlockchains.length > 0) {
        const nextConnectedWallets = get().connectedWallets.map(
          (connectedWallet) => {
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
          }
        );

        set({
          connectedWallets: nextConnectedWallets,
        });
      }
    },
    clearConnectedWallet: () => set({ connectedWallets: [] }),
    fetchBalances: async (accounts, options) => {
      const connectedWallets = get().connectedWallets;
      get().setConnectedWalletAsRefetching(accounts);

      const addressesToFetch = accounts.map((account) => ({
        address: account.address,
        blockchain: account.chain,
      }));

      let response;
      try {
        response = await httpService().getWalletsDetails(addressesToFetch);
      } catch (e) {
        get().setConnectedWalletHasError(accounts);
        throw new Error(`Request for fetching balances failed.`, { cause: e });
      }

      const walletsDetails = response.wallets;

      if (walletsDetails) {
        const { retryOnFailedBalances = true } = options || {};
        if (retryOnFailedBalances) {
          const failedWallets = connectedWallets.filter((connectedWallet) =>
            walletsDetails.find(
              (walletDetails) =>
                connectedWallet.address === walletDetails.address &&
                connectedWallet.chain === walletDetails.blockChain &&
                walletDetails.failed
            )
          );
          if (failedWallets.length > 0) {
            void get().fetchBalances(failedWallets, {
              retryOnFailedBalances: false,
            });
          }
        }

        let nextBalances: BalanceState = {};
        let nextAggregatedBalances: AggregatedBalanceState =
          get()._aggregatedBalances;
        const successfulWallets = connectedWallets.filter((connectedWallet) =>
          walletsDetails.find(
            (walletDetails) =>
              connectedWallet.address === walletDetails.address &&
              connectedWallet.chain === walletDetails.blockChain &&
              !walletDetails.failed
          )
        );
        const successfulWalletsObj: { [key: string]: string[] } =
          successfulWallets.reduce((obj, curr) => {
            if (!obj[curr.walletType]) {
              obj[curr.walletType] = [];
            }
            obj[curr.walletType].push(curr.chain);
            return obj;
          }, {} as { [key: string]: string[] });

        // Remove old balances for current wallet and blockchain
        Object.keys(successfulWalletsObj).forEach((walletType) =>
          get().removeBalancesForWallet(walletType, {
            chains: successfulWalletsObj[walletType],
          })
        );
        walletsDetails.forEach((wallet) => {
          if (wallet.failed) {
            return;
          }

          /*
           * Check if after fetching balance for an account, the account still exists.
           * (It might get disconnected while fetching balances is pending)
           */
          if (
            !successfulWallets.find(
              (connectedWallet) =>
                connectedWallet.address === wallet.address &&
                connectedWallet.chain === wallet.blockChain
            )
          ) {
            return;
          }

          const balancesForWallet = createBalanceStateForNewAccount(
            wallet,
            get
          );

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

        get().setConnectedWalletRetrievedData(accounts, walletsDetails);
      } else {
        get().setConnectedWalletHasError(accounts);
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

          const [, , , balanceWalletAddreess] =
            balanceKey.split(BALANCE_SEPARATOR);
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
      return memoizedConnectedWalletsWithNestedBalances(() => {
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

                const amount = balance.amount
                  ? new BigNumber(balance.amount).shiftedBy(-balance.decimals)
                  : ZERO;

                output.push({
                  chain: wallet.chain,
                  symbol: asset.symbol,
                  ticker: asset.symbol,
                  address: asset.address,
                  rawAmount: balance.amount,
                  decimal: balance.decimals,
                  amount: amount.toString(),
                  logo: token?.image || null,
                  usdPrice: token?.usdPrice || null,
                });
              }

              return output;
            }, [] as DeprecatedTokenBalance[]),
          };
        });
      }, get().lastUpdatedAt);
    },
  })
);
