import type { Balance } from '../../types';
import type { AppStoreState } from '../app';
import type { Asset, WalletDetail } from 'rango-types';

import BigNumber from 'bignumber.js';

import { ZERO } from '../../constants/numbers';
import { BALANCE_SEPARATOR } from '../../constants/wallets';
import {
  type AggregatedBalanceState,
  type AssetKey,
  type BalanceKey,
  type BalanceState,
} from '../slices/wallets';

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

export function extractAssetFromBalanceKey(key: BalanceKey): Asset {
  const [assetChain, assetAddress, assetSymbol] = key.split(BALANCE_SEPARATOR);

  // null will be serialized to 'null', we need to make it back to a null type
  const address = assetAddress === 'null' ? null : assetAddress;
  return {
    address,
    blockchain: assetChain,
    symbol: assetSymbol,
  };
}

export function updateBalancesWithNewPrices(
  wallet: Omit<WalletDetail, 'failed' | 'explorerUrl'>,
  balanceState: BalanceState,
  store: () => AppStoreState
): BalanceState {
  wallet.balances?.forEach((balance) => {
    const usdPrice =
      balance.price ?? store().findToken(balance.asset)?.usdPrice;
    const balancesToUpdate =
      store()._aggregatedBalances[createAssetKey(balance.asset)];

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

  return aggregatedBalances;
}

export function removeBalanceFromAggregatedBalance(
  aggregatedBalances: AggregatedBalanceState,
  balanceKey: BalanceKey
) {
  const asset = extractAssetFromBalanceKey(balanceKey);
  const assetKey = createAssetKey(asset);

  if (aggregatedBalances[assetKey]) {
    aggregatedBalances[assetKey] = aggregatedBalances[assetKey].filter(
      (aggregatedBalance) => aggregatedBalance !== balanceKey
    );
  }

  return aggregatedBalances;
}
