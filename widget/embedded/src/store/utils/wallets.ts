import type { Balance } from '../../types';
import type { AppStoreState } from '../app';
import type { FindToken } from '../slices/data';
import type {
  AggregatedBalanceState,
  AssetKey,
  BalanceKey,
  BalanceState,
  ConnectedWallet,
} from '../slices/wallets';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';
import type { Asset, WalletDetail } from 'rango-types';

import BigNumber from 'bignumber.js';

import { ZERO } from '../../constants/numbers';
import { BALANCE_SEPARATOR } from '../../constants/wallets';

/**
 * Note: We need to use `symbol` as well since native coins and cosmos blockchains don't have `address`
 * output format: BlockchainId${BALANCE_SEPARATOR}TokenAddress${BALANCE_SEPARATOR}TokenSymbol
 */
export function createAssetKey(asset: Asset): AssetKey {
  return `${asset.blockchain}${BALANCE_SEPARATOR}${asset.address}${BALANCE_SEPARATOR}${asset.symbol}`;
}

/**
 * output format: BlockchainId${BALANCE_SEPARATOR}TokenAddress${BALANCE_SEPARATOR}TokenSymbol${BALANCE_SEPARATOR}WalletAddress
 */
export function createBalanceKey(
  accountAddress: string,
  asset: Asset
): BalanceKey {
  const assetKey = createAssetKey(asset);
  return `${assetKey}${BALANCE_SEPARATOR}${accountAddress}`;
}

export function extractAssetFromBalanceKey(key: BalanceKey): Asset | null {
  const [assetChain, assetAddress, assetSymbol] = key.split(BALANCE_SEPARATOR);

  if (!assetChain || !assetAddress || !assetSymbol) {
    return null;
  }

  // null will be serialized to 'null', we need to make it back to a null type
  const address = assetAddress === 'null' ? null : assetAddress;
  return {
    address,
    blockchain: assetChain,
    symbol: assetSymbol,
  };
}

export function computeNextBalancesWithNewPrices(
  paritalCurrentState: {
    findToken: FindToken;
    _aggregatedBalances: AggregatedBalanceState;
  },
  wallet: Omit<WalletDetail, 'failed' | 'explorerUrl'>,
  balanceState: BalanceState
): BalanceState {
  wallet.balances?.forEach((balance) => {
    const usdPrice =
      balance.price ?? paritalCurrentState.findToken(balance.asset)?.usdPrice;
    const balancesToUpdate =
      paritalCurrentState._aggregatedBalances[createAssetKey(balance.asset)];

    balancesToUpdate?.forEach((balanceKey) => {
      if (balanceState[balanceKey]) {
        balanceState[balanceKey] = {
          ...balanceState[balanceKey],
          usdValue: usdPrice
            ? new BigNumber(usdPrice ?? ZERO)
                .multipliedBy(balanceState[balanceKey].amount)
                .toString()
            : '',
        };
      }
    });
  });

  return balanceState;
}

export function createBalanceStateForNewAccount(
  account: Omit<WalletDetail, 'failed' | 'explorerUrl'>,
  store: () => AppStoreState
): BalanceState {
  const state: BalanceState = {};

  account.balances?.forEach((accountBalance) => {
    const key = createBalanceKey(account.address, accountBalance.asset);
    const amount = accountBalance.amount.amount;
    const decimals = accountBalance.amount.decimals;

    const usdPrice =
      accountBalance.price ?? store().findToken(accountBalance.asset)?.usdPrice;
    const usdValue = usdPrice
      ? new BigNumber(usdPrice ?? ZERO).multipliedBy(amount).toString()
      : '';

    const balance: Balance = {
      amount,
      decimals,
      usdValue,
    };

    state[key] = balance;
  });

  return state;
}

export function updateAggregatedBalanceStateForNewAccount(
  aggregatedBalances: AggregatedBalanceState,
  balanceState: BalanceState
) {
  for (const balanceKey in balanceState) {
    const asset = extractAssetFromBalanceKey(balanceKey as BalanceKey);
    if (asset) {
      const assetKey = createAssetKey(asset);

      if (!aggregatedBalances[assetKey]) {
        aggregatedBalances[assetKey] = [];
      }

      if (!aggregatedBalances[assetKey].includes(balanceKey as BalanceKey)) {
        aggregatedBalances[assetKey] = [
          ...aggregatedBalances[assetKey],
          balanceKey as BalanceKey,
        ];
      }
    }
  }

  return aggregatedBalances;
}

export function removeBalanceFromAggregatedBalance(
  aggregatedBalances: AggregatedBalanceState,
  balanceKey: BalanceKey
) {
  const asset = extractAssetFromBalanceKey(balanceKey);
  if (!asset) {
    return aggregatedBalances;
  }
  const assetKey = createAssetKey(asset);

  if (aggregatedBalances[assetKey]) {
    aggregatedBalances[assetKey] = aggregatedBalances[assetKey].filter(
      (aggregatedBalance) => aggregatedBalance !== balanceKey
    );
  }

  return aggregatedBalances;
}

/**
 * We made a util to remvoe balances to be able batch with other state updates.
 */
export function computeNextStateAfterWalletBalanceRemoval(
  paritalCurrentState: {
    _balances: BalanceState;
    _aggregatedBalances: AggregatedBalanceState;
    connectedWallets: ConnectedWallet[];
  },
  walletType: string,
  options?: {
    chains?: string[];
    namespaces?: Namespace[];
  }
) {
  let walletsNeedsToBeRemoved = paritalCurrentState.connectedWallets.filter(
    (connectedWallet) => connectedWallet.walletType === walletType
  );

  /*
   * We only need to delete balances where there is no connected wallets with same chain and address for that balance.
   * Consider both Metamask and Solana having support for `0xblahblahblahblah` for Ethereum.
   * If Phantom is disconnecting, we should keep the balance since Metamask has access to same address yet.
   * So we only delete balance when there is no connected wallet that has access to that specific chain and address.
   */
  paritalCurrentState.connectedWallets.forEach((connectedWallet) => {
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
    paritalCurrentState._aggregatedBalances;
  const currentBalancesState = paritalCurrentState._balances;
  const balanceKeys = Object.keys(currentBalancesState) as BalanceKey[];

  balanceKeys.forEach((key) => {
    const asset = extractAssetFromBalanceKey(key);
    if (!asset) {
      return;
    }

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
    } else if (currentBalancesState[key]) {
      nextBalancesState[key] = currentBalancesState[key];
    }
  });

  return {
    _balances: nextBalancesState,
    _aggregatedBalances: nextAggregatedBalanceState,
  };
}
