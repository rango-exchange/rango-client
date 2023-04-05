import { LiquiditySourcesSelector } from '@rango-dev/ui';
import React from 'react';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { removeDuplicateFrom } from '../utils/common';
// interface PropTypes {
//   supportedSwappers: 'all' | SwapperMeta[];
// }
export function LiquiditySourcePage() {
  const swappers = useMetaStore.use.meta().swappers;
  const toggleLiquiditySource = useSettingsStore.use.toggleLiquiditySource();
  const disabledLiquiditySources =
    useSettingsStore.use.disabledLiquiditySources();
  const toggleAllLiquiditySources =
    useSettingsStore.use.toggleAllLiquiditySources();

  const { navigateBackFrom } = useNavigateBack();

  const uniqueSwappersGroups: Array<{
    title: string;
    logo: string;
    type: 'BRIDGE' | 'AGGREGATOR' | 'DEX';
    selected: boolean;
  }> = [];
  removeDuplicateFrom(swappers.map((s) => s.swapperGroup))
    .map((swapperGroup) => {
      return swappers.find((s) => s.swapperGroup === swapperGroup);
    })
    .find((s) => {
      if (s) {
        for (const type of s.types) {
          uniqueSwappersGroups.push({
            title: s.swapperGroup,
            logo: s.logo,
            type,
            selected: !disabledLiquiditySources.includes(s.swapperGroup),
          });
        }
      }
    });

  return (
    <LiquiditySourcesSelector
      toggleAll={toggleAllLiquiditySources}
      list={uniqueSwappersGroups}
      onChange={(liquiditySource) =>
        toggleLiquiditySource(liquiditySource.title)
      }
      onBack={navigateBackFrom.bind(null, navigationRoutes.liquiditySources)}
    />
  );
}
