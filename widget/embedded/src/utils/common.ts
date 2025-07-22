import type { WalletInfoWithExtra } from '../types';
import type { Token } from 'rango-sdk';

import { BlockchainCategories, WalletState } from '@arlert-dev/ui';
import { TransactionType } from 'rango-sdk';

import { WIDGET_UI_ID } from '../constants';
import { SUPPORTED_FONTS } from '../constants/fonts';
import {
  MIN_LENGTH_SYMBOL_CONTAINS,
  MIN_LENGTH_SYMBOL_START_WITH,
  MIN_LENGTH_TOKEN_ADDRESS_CONTAINS,
  MIN_LENGTH_TOKEN_NAME_CONTAINS,
  MIN_LENGTH_TOKEN_NAME_EXACT_MATCH,
} from '../constants/searchFor';

export function removeDuplicateFrom<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function areEqual(
  array1: (number | string)[],
  array2: (number | string)[]
) {
  return (
    array1.length === array2.length && array1.every((v, i) => v === array2[i])
  );
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function debounce(fn: Function, time: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null;
  return wrapper;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function wrapper(...args: any) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, time);
  }
}

export function containsText(text: string, searchText: string): boolean {
  return text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
}

export function exactText(text: string, searchText: string): boolean {
  return text.toLowerCase() === searchText.toLowerCase();
}

export function startWithText(text: string, searchText: string): boolean {
  return text.toLowerCase().startsWith(searchText.toLowerCase());
}

export const getContainer = () =>
  document.getElementById(WIDGET_UI_ID.SWAP_BOX_ID) as HTMLElement;

export const getExpanded = () =>
  document.getElementById(WIDGET_UI_ID.EXPANDED_BOX_ID) as HTMLElement;

function compareExactMatchText(
  searchFor: string,
  textA: string | null,
  textB: string | null
) {
  const exactMatchA = !!textA && exactText(textA, searchFor);
  const exactMatchB = !!textB && exactText(textB, searchFor);
  if (exactMatchA !== exactMatchB) {
    return exactMatchA ? -1 : 1;
  }

  return 0;
}

function compareContainsText(
  searchFor: string,
  textA: string | null,
  textB: string | null
) {
  const textContainsA = !!textA && containsText(textA, searchFor);
  const textContainsB = !!textB && containsText(textB, searchFor);
  if (textContainsA !== textContainsB) {
    return textContainsA ? -1 : 1;
  }

  // If both texts contains the searched term, The shorter one has priority
  if (textContainsA && textContainsB && textA?.length !== textB?.length) {
    return textA?.length - textB?.length;
  }

  return 0;
}

function compareStartWithText(
  searchFor: string,
  textA: string | null,
  textB: string | null
) {
  const textStartWithA = !!textA && startWithText(textA, searchFor);
  const textStartWithB = !!textB && startWithText(textB, searchFor);
  if (textStartWithA !== textStartWithB) {
    return textStartWithA ? -1 : 1;
  }

  // If both texts start with the searched term, The shorter one has priority
  if (textStartWithA && textStartWithB && textA?.length !== textB?.length) {
    return textA?.length - textB?.length;
  }

  return 0;
}

export function compareWithSearchFor(
  tokenA: Token,
  tokenB: Token,
  searchFor?: string
): number {
  if (!searchFor) {
    return 0;
  }

  // 1: Check the order to exact match the symbol
  const symbolExactMatchCompare = compareExactMatchText(
    searchFor,
    tokenA.symbol,
    tokenB.symbol
  );
  if (symbolExactMatchCompare) {
    return symbolExactMatchCompare;
  }

  // 2: Check the order to exact match the token name
  if (searchFor.length >= MIN_LENGTH_TOKEN_NAME_EXACT_MATCH) {
    const tokenNameExactMatchCompare = compareExactMatchText(
      searchFor,
      tokenA.name,
      tokenB.name
    );
    if (tokenNameExactMatchCompare) {
      return tokenNameExactMatchCompare;
    }
  }

  // 3: Check symbol start with searchFor
  if (searchFor.length >= MIN_LENGTH_SYMBOL_START_WITH) {
    const symbolStartWithCompare = compareStartWithText(
      searchFor,
      tokenA.symbol,
      tokenB.symbol
    );

    if (symbolStartWithCompare) {
      return symbolStartWithCompare;
    }
  }

  // 4: Check symbol Contains searchFor
  if (searchFor.length >= MIN_LENGTH_SYMBOL_CONTAINS) {
    const symbolContainsCompare = compareContainsText(
      searchFor,
      tokenA.symbol,
      tokenB.symbol
    );

    if (symbolContainsCompare) {
      return symbolContainsCompare;
    }
  }

  // 5: Check token name start with searchFor
  if (searchFor.length >= MIN_LENGTH_TOKEN_NAME_CONTAINS) {
    const tokenNameStartWithCompare = compareStartWithText(
      searchFor,
      tokenA.name,
      tokenB.name
    );

    if (tokenNameStartWithCompare) {
      return tokenNameStartWithCompare;
    }
  }

  // 6: Check token name Contains searchFor
  if (searchFor.length >= MIN_LENGTH_TOKEN_NAME_CONTAINS) {
    const tokenNameContainsCompare = compareContainsText(
      searchFor,
      tokenA.name,
      tokenB.name
    );

    if (tokenNameContainsCompare !== 0) {
      return tokenNameContainsCompare;
    }
  }

  // 7: Check address start with searchFor
  if (searchFor.length >= MIN_LENGTH_TOKEN_ADDRESS_CONTAINS) {
    const addressStartWithCompare = compareStartWithText(
      searchFor,
      tokenA.address,
      tokenB.address
    );

    if (addressStartWithCompare) {
      return addressStartWithCompare;
    }
  }

  // 8: Check address Contains searchFor
  if (searchFor.length >= MIN_LENGTH_TOKEN_ADDRESS_CONTAINS) {
    const addressContainCompare = compareContainsText(
      searchFor,
      tokenA.address,
      tokenB.address
    );

    if (addressContainCompare !== 0) {
      return addressContainCompare;
    }
  }

  return 0;
}

export const isBlockchainTypeInCategory = (
  blockchainType: TransactionType,
  category: string
): boolean => {
  switch (category) {
    case BlockchainCategories.ALL:
      return true;
    case BlockchainCategories.UTXO:
      return blockchainType === TransactionType.TRANSFER;
    case BlockchainCategories.OTHER:
      return (
        blockchainType !== TransactionType.TRANSFER &&
        blockchainType !== TransactionType.COSMOS &&
        blockchainType !== TransactionType.EVM
      );
    default:
      return blockchainType === category;
  }
};

export const getFontUrlByName = (fontName: string) => {
  const font = SUPPORTED_FONTS.find((font) => font.value === fontName);
  return font?.url;
};

export function isSingleWalletActive(
  wallets: WalletInfoWithExtra[],
  multiWallets?: boolean
) {
  const atLeastOneWalletIsConnected = !!wallets.find(
    (w) => w.state === WalletState.CONNECTED
  );
  return multiWallets === false && atLeastOneWalletIsConnected;
}

/**
 * A simple memo implementation
 * you can use it when you want to memoize a value in js space
 */
export function memoizedResult(): <R>(fn: () => R, key: number | string) => R {
  let currentKey: number | string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any;

  return (fn, key) => {
    if (!result || !currentKey || currentKey !== key) {
      currentKey = key;
      result = fn();
      return result;
    }

    return result;
  };
}
