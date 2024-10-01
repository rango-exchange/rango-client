import type { Balance } from '../../types';
import type { AppStoreState } from '../app';
import type { AssetKey, BalanceKey, BalanceState } from '../slices/wallets';
import type { Asset, WalletDetail } from 'rango-types';

import BigNumber from 'bignumber.js';

import { ZERO } from '../../constants/numbers';

/**
 * output format: BlockchainId-TokenAddress
 */
export function createAssetKey(
  asset: Pick<Asset, 'address' | 'blockchain'>
): AssetKey {
  return `${asset.blockchain}-${asset.address}`;
}

/**
 * output format: BlockchainId-TokenAddress-WalletAddress
 */
export function createBalanceKey(
  accountAddress: string,
  asset: Pick<Asset, 'address' | 'blockchain'>
): BalanceKey {
  const assetKey = createAssetKey(asset);
  return `${assetKey}-${accountAddress}`;
}

export function extractAssetFromBalanceKey(
  key: BalanceKey
): Pick<Asset, 'address' | 'blockchain'> {
  const [assetChain, assetAddress] = key.split('-');

  return {
    address: assetAddress,
    blockchain: assetChain,
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
