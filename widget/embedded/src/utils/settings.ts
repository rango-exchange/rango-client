import type { SwapperMeta } from 'rango-sdk';

import { useSettingsStore } from '../store/settings';

import { removeDuplicateFrom } from './common';

export type LiquiditySourceType = 'BRIDGE' | 'AGGREGATOR' | 'DEX';

export type UniqueSwappersGroupType = {
  id: string;
  groupTitle: string;
  logo: string;
  type: LiquiditySourceType;
  selected: boolean;
};

export function getUniqueSwappersGroups(
  swappers: SwapperMeta[]
): UniqueSwappersGroupType[] {
  const disabledLiquiditySources =
    useSettingsStore.use.disabledLiquiditySources();
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
