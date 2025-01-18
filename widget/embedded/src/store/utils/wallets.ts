import type { Balance } from '../../types';
import type { AppStoreState } from '../app';
import type {
  AggregatedBalanceState,
  AssetKey,
  BalanceKey,
  BalanceState,
} from '../slices/wallets';
import type { Asset, WalletDetail } from 'rango-types';

import BigNumber from 'bignumber.js';

import { ZERO } from '../../constants/numbers';

/**
 * Note: We need to use `symbol` as well since native coins and cosmos blockchains don't have `address`
 * output format: BlockchainId-TokenAddress-TokenSymbol
 */
export function createAssetKey(asset: Asset): AssetKey {
  return `${asset.blockchain}-${asset.address}-${asset.symbol}`;
}

/**
 * output format: BlockchainId-TokenAddress-TokenSymbol-WalletAddress
 */
export function createBalanceKey(
  accountAddress: string,
  asset: Asset
): BalanceKey {
  const assetKey = createAssetKey(asset);
  return `${assetKey}-${accountAddress}`;
}

export function extractAssetFromBalanceKey(key: BalanceKey): Asset {
  const [assetChain, assetAddress, assetSymbol] = key.split('-');

  // null will be serialized to 'null', we need to make it back to a null type
  const address = assetAddress === 'null' ? null : assetAddress;
  return {
    address,
    blockchain: assetChain,
    symbol: assetSymbol,
  };
}

export function createBalanceStateForNewAccount(
  account: WalletDetail,
  store: () => AppStoreState
): BalanceState {
  const state: BalanceState = {};

  account.balances?.forEach((accountBalance) => {
    const key = createBalanceKey(account.address, accountBalance.asset);
    const amount = accountBalance.amount.amount;
    const decimals = accountBalance.amount.decimals;

    const usdPrice = store().findToken(accountBalance.asset)?.usdPrice;
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
