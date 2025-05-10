import type { Features, HighSlippageWarning, Routing } from '../types';
import type { SwapperMeta, SwapperType, Token } from 'rango-sdk';

import { i18n } from '@lingui/core';

import {
  HIGH_SLIPPAGE,
  MAX_SLIPPAGE,
  MIN_SLIPPAGE,
} from '../constants/swapSettings';
import { QuoteWarningType } from '../types';

import { removeDuplicateFrom } from './common';

export type UniqueSwappersGroupType = {
  id: string;
  groupTitle: string;
  logo: string;
  type: SwapperType;
  selected: boolean;
};

export function getUniqueSwappersGroups(
  swappers: SwapperMeta[],
  disabledLiquiditySources: string[]
): UniqueSwappersGroupType[] {
  const supportedSwappers = swappers.map((swapper) => swapper.swapperGroup);

  const uniqueSupportedSwappersGroups: Array<UniqueSwappersGroupType> = [];

  const uniqueGroup = removeDuplicateFrom(swappers.map((s) => s.swapperGroup));

  uniqueGroup.map((uniqueGroupItem) => {
    const swapperItem = swappers.find(
      (swapper) => swapper.swapperGroup === uniqueGroupItem
    );

    if (swapperItem) {
      let isSupportedSwapper = true;
      if (supportedSwappers) {
        isSupportedSwapper = supportedSwappers.some(
          (supportedItem) => supportedItem === swapperItem.swapperGroup
        );
      }

      if (isSupportedSwapper) {
        swapperItem.types.map((swapperTypeItem) => {
          uniqueSupportedSwappersGroups.push({
            id: swapperItem.swapperGroup,
            groupTitle: swapperItem.swapperGroup,
            logo: swapperItem.logo,
            type: swapperTypeItem,
            selected: !disabledLiquiditySources.includes(
              swapperItem.swapperGroup
            ),
          });
        });
      }
    }
  });

  return uniqueSupportedSwappersGroups;
}

export function sortLiquiditySourcesByGroupTitle(
  a: SwapperMeta,
  b: SwapperMeta
) {
  if (a.swapperGroup < b.swapperGroup) {
    return -1;
  }

  if (a.swapperGroup > b.swapperGroup) {
    return 1;
  }

  return 0;
}

export function isFeatureHidden(feature: keyof Features, features?: Features) {
  return features?.[feature] === 'hidden';
}

export function isRoutingEnabled(item: keyof Routing, routing?: Routing) {
  return routing?.[item] === 'enabled';
}

export const addCustomTokensToSupportedTokens = (
  supportedTokens: Token[],
  customTokens: Token[],
  features?: Features
) => {
  const isCustomTokensHidden = isFeatureHidden('customTokens', features);

  return isCustomTokensHidden
    ? supportedTokens
    : supportedTokens.concat(customTokens);
};

export function getSlippageValidation(slippage: number): {
  type: 'error' | 'warning';
  message: string;
  quoteValidation?: HighSlippageWarning;
} | null {
  if (slippage == MIN_SLIPPAGE) {
    return {
      type: 'error',
      message: i18n.t('Slippage must be greater than or equal to 0.01'),
    };
  } else if (slippage > HIGH_SLIPPAGE && slippage <= MAX_SLIPPAGE) {
    return {
      type: 'warning',
      message: i18n.t(
        'Your transaction is at risk of being frontrun due to high slippage tolerance.'
      ),
      quoteValidation: {
        type: QuoteWarningType.HIGH_SLIPPAGE,
        slippage: slippage.toString(),
      },
    };
  }

  return null;
}
