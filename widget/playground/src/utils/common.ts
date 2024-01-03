import type { Asset } from 'rango-sdk';

import { WalletTypes } from '@yeager-dev/wallets-shared';

export function shallowEqual<T>(
  object1: { [x: string]: T | undefined },
  object2: { [x: string]: T | undefined }
) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}

export const tokenToString = (token: Asset) =>
  `${token.symbol}-${token.blockchain}-${token.address ?? ''}`;

export function removeDuplicates<T>(arr: T[], key?: keyof T): T[] {
  if (!key) {
    return Array.from(new Set(arr));
  }

  const seen = new Set<T[keyof T]>();

  return arr.filter(
    (item) =>
      typeof item[key] !== 'undefined' &&
      !seen.has(item[key]) &&
      seen.add(item[key])
  );
}

export function tokensAreEqual(tokenA?: Asset, tokenB?: Asset) {
  return (
    tokenA?.blockchain === tokenB?.blockchain &&
    tokenA?.symbol === tokenB?.symbol &&
    tokenA?.address === tokenB?.address
  );
}

export const excludedWallets = [
  WalletTypes.STATION,
  WalletTypes.LEAP,
  WalletTypes.SAFE,
  WalletTypes.MY_TON_WALLET,
  WalletTypes.WALLET_CONNECT_2,
];
