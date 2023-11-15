import type { Asset, Token } from 'rango-sdk';

import { WalletTypes } from '@rango-dev/wallets-shared';

import { NOT_FOUND } from '../constants';

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

export const containsText = (text: string, searchText: string) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > NOT_FOUND;

export const filterTokens = (list: Token[], searchedFor: string) =>
  list.filter(
    (token) =>
      containsText(token.symbol, searchedFor) ||
      containsText(token.address || '', searchedFor) ||
      containsText(token.name || '', searchedFor)
  );

export const excludedWallets = [
  WalletTypes.STATION,
  WalletTypes.LEAP,
  WalletTypes.SAFE,
  WalletTypes.MY_TON_WALLET,
  WalletTypes.WALLET_CONNECT_2,
  WalletTypes.BINANCE_CHAIN,
];

export const onChangeMultiSelects = (
  value: string,
  values: any[] | undefined,
  list: any[],
  findIndex: (item: string) => boolean
): string[] | undefined => {
  if (value === 'empty') {
    return [];
  } else if (value === 'all') {
    return undefined;
  }
  if (!values) {
    values = [...list];
    const index = list.findIndex(findIndex);
    values.splice(index, 1);
    return values;
  }
  values = [...values];
  const index = values.findIndex(findIndex);
  if (index !== NOT_FOUND) {
    values.splice(index, 1);
  } else {
    values.push(value);
  }
  if (values.length === list.length) {
    return undefined;
  }
  return values;
};
