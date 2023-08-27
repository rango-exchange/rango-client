import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';

import { removeDuplicateFrom } from './common';

type LiquiditySourceType = 'BRIDGE' | 'AGGREGATOR' | 'DEX';

type UniqueSwappersGroupType = {
  title: string;
  logo: string;
  type: LiquiditySourceType;
  selected: boolean;
};

export function getUniqueSwappersGroups(
  supportedSwappers?: string[]
): UniqueSwappersGroupType[] {
  const swappers = useMetaStore.use.meta().swappers;
  const disabledLiquiditySources =
    useSettingsStore.use.disabledLiquiditySources();

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
          (supportedItem) => supportedItem === swapperItem.title
        );
      }

      if (isSupportedSwapper) {
        swapperItem.types.map((swapperTypeItem) => {
          uniqueSupportedSwappersGroups.push({
            title: swapperItem.swapperGroup,
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
