import type { AppStoreState } from './types';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';
import type { Asset, Token, WalletDetail } from 'rango-sdk';

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
  computeNextBalancesWithNewPrices,
  computeNextStateAfterWalletBalanceRemoval,
  createAssetKey,
  createBalanceStateForNewAccount,
  extractAssetFromBalanceKey,
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
  isSupported: boolean;
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
  addConnectedWallet: (
    accounts: Wallet[],
    namespace?: Namespace,
    derivationPath?: string
  ) => void;
  setWalletsAsSelected: (
    wallets: { walletType: string; chain: string }[]
  ) => void;
  /**
   * Add new accounts to store and fetch balances for them.
   */
  newWalletConnected: (
    accounts: Wallet[],
    namespace?: Namespace,
    derivationPath?: string
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
    options?: {
      shouldFetchCustomTokens?: boolean;
      selectedCustomTokens?: Asset[];
    }
  ) => Promise<void>;
  fetchMainTokensBalances: (
    accounts: Wallet[],
    options?: { retryOnFailedBalances?: boolean }
  ) => Promise<void>;
  fetchCustomTokensBalances: (params: {
    tokens: Asset[];
    connectedWallets: Wallet[];
  }) => Promise<void>;
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
    addConnectedWallet: (accounts, namespace, derivationPath) => {
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
              isContractWallet: account.isContractWallet,
              explorerUrl: null,
              walletType: account.walletType,
              selected: shouldMarkWalletAsSelected,
              namespace: namespace,
              derivationPath: derivationPath,
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
    fetchCustomTokensBalances: async (params) => {
      const { tokens, connectedWallets } = params;

      const tokensByBlockchain = tokens.reduce<{ [key: string]: Asset[] }>(
        (acc, asset) => {
          (acc[asset.blockchain] ||= []).push(asset);
          return acc;
        },
        {}
      );

      const addedWallets = new Set<string>();

      const tokensByWalletAddress = connectedWallets.reduce<{
        [key: string]: Asset[];
      }>((acc, wallet) => {
        const key = `${wallet.address}-${wallet.chain}`;
        if (addedWallets.has(key)) {
          return acc;
        }

        addedWallets.add(key);
        if (tokensByBlockchain[wallet.chain]) {
          if (!acc[wallet.address]) {
            acc[wallet.address] = [];
          }
          acc[wallet.address].push(...tokensByBlockchain[wallet.chain]);
        }
        return acc;
      }, {});

      Object.entries(tokensByWalletAddress).forEach(
        async ([walletAddress, tokens]) => {
          try {
            const { balances } = await httpService().getMultipleTokenBalance({
              assets: tokens.map(({ symbol, address, blockchain }) => ({
                symbol,
                address,
                blockchain,
              })),
              walletAddress,
            });

            if (balances) {
              let nextBalances: BalanceState = get()._balances;
              let nextAggregatedBalances: AggregatedBalanceState =
                get()._aggregatedBalances;

              balances.forEach((balance) => {
                if (parseFloat(balance.amount.amount) === 0) {
                  return;
                }

                const walletDetail = {
                  blockChain: balance.asset.blockchain,
                  balances: [balance],
                  address: walletAddress,
                };

                const partialCurrentState = {
                  _aggregatedBalances: get()._aggregatedBalances,
                  findToken: get().findToken,
                };
                computeNextBalancesWithNewPrices(
                  partialCurrentState,
                  walletDetail,
                  nextBalances
                );

                const balancesForWallet = createBalanceStateForNewAccount(
                  walletDetail,
                  get
                );

                nextAggregatedBalances =
                  updateAggregatedBalanceStateForNewAccount(
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
            }
          } catch (error) {
            console.error(error);
          }
        }
      );
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
    newWalletConnected: async (accounts, namespace, derivationPath) => {
      eventEmitter.emit(WidgetEvents.WalletEvent, {
        type: WalletEventTypes.CONNECT,
        payload: { walletType: accounts[0].walletType, accounts },
      });

      get().addConnectedWallet(accounts, namespace, derivationPath);

      void get().fetchBalances(accounts);
    },
    removeBalancesForWallet: (walletType, options) => {
      const partialCurrentState = {
        _balances: get()._balances,
        _aggregatedBalances: get()._aggregatedBalances,
        connectedWallets: get().connectedWallets,
      };
      const { _balances, _aggregatedBalances } =
        computeNextStateAfterWalletBalanceRemoval(
          partialCurrentState,
          walletType,
          options
        );

      set({
        _balances,
        _aggregatedBalances,
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
      const { shouldFetchCustomTokens = true, selectedCustomTokens } =
        options || {};
      await get().fetchMainTokensBalances(accounts);
      if (shouldFetchCustomTokens) {
        void get().fetchCustomTokensBalances({
          tokens: selectedCustomTokens ?? get().customTokens(),
          connectedWallets: accounts,
        });
      }
    },
    fetchMainTokensBalances: async (accounts, options) => {
      if (accounts.length === 0) {
        return;
      }
      // All the `accounts` have same `walletType` so we can pick the first one.
      const walletType = accounts[0].walletType;

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
        console.error(`Request for fetching balances failed. cause: ${e}`);
        return;
      }
      const walletsDetails = response.wallets;

      if (walletsDetails) {
        let nextBalances: BalanceState = get()._balances;
        let nextAggregatedBalances: AggregatedBalanceState =
          get()._aggregatedBalances;
        walletsDetails.forEach((wallet) => {
          if (wallet.failed) {
            return;
          }

          const partialCurrentState = {
            _balances: nextBalances,
            _aggregatedBalances: nextAggregatedBalances,
            connectedWallets: get().connectedWallets,
            findToken: get().findToken,
          };

          computeNextBalancesWithNewPrices(
            partialCurrentState,
            wallet,
            nextBalances
          );

          // Remove old balances for current wallet and blockchain
          const { _balances, _aggregatedBalances } =
            computeNextStateAfterWalletBalanceRemoval(
              partialCurrentState,
              walletType,
              {
                chains: [wallet.blockChain],
              }
            );
          nextAggregatedBalances = _aggregatedBalances;
          nextBalances = _balances;

          /*
           * Check if after fetching balance for an account, the account still exists.
           * (It might get disconnected while fetching balances is pending)
           */
          if (
            !get().connectedWallets.find(
              (connectedWallet) =>
                connectedWallet.walletType === walletType &&
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
        /*
         * We handle failed balance fetches after updating the state with successful ones.
         * This ensures that successful balance updates are immediately available to the UI,
         * while failed ones are retried in the background without blocking the main flow.
         * The retry is only attempted once to prevent infinite loops.
         */
        const { retryOnFailedBalances = true } = options || {};
        if (retryOnFailedBalances) {
          const failedWallets: Wallet[] = walletsDetails
            .filter((wallet) => wallet.failed)
            .map((wallet) => ({
              chain: wallet.blockChain,
              walletType: walletType,
              address: wallet.address,
            }));
          if (failedWallets.length > 0) {
            await get().fetchMainTokensBalances(failedWallets, {
              retryOnFailedBalances: false,
            });
          }
        }
      } else {
        get().setConnectedWalletHasError(accounts);
        console.error(
          "We couldn't fetch your account balances. Seem there is no information on blockchain for them yet."
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
                  isSupported: !!token,
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
