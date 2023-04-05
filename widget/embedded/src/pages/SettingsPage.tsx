import React from 'react';
import { Settings } from '@rango-dev/ui';
import { useSettingsStore } from '../store/settings';
import { useMetaStore } from '../store/meta';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';
import { removeDuplicateFrom } from '../utils/common';
import {
  MAX_SLIPPAGE,
  MIN_SLIPPGAE,
  SLIPPAGES,
} from '../constants/swapSettings';
import { useNavigateBack } from '../hooks/useNavigateBack';

// interface PropTypes {
//   supportedSwappers: 'all' | SwapperMeta[];
// }
export function SettingsPage() {
  const slippage = useSettingsStore.use.slippage();
  const setSlippage = useSettingsStore.use.setSlippage();
  const disabledLiquiditySources =
    useSettingsStore.use.disabledLiquiditySources();
  const customSlippage = useSettingsStore.use.customSlippage();
  const setCustomSlippage = useSettingsStore.use.setCustomSlippage();
  const theme = useSettingsStore.use.theme();
  const setTheme = useSettingsStore.use.setTheme();
  const swappers = useMetaStore.use.meta().swappers;
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();

  const infiniteApprove = useSettingsStore.use.infiniteApprove();
  const toggleInfiniteApprove = useSettingsStore.use.toggleInfiniteApprove();
  const uniqueSwappersGroups: Array<{
    title: string;
    logo: string;
    type: 'BRIDGE' | 'AGGREGATOR' | 'DEX';
    selected: boolean;
  }> = [];
  removeDuplicateFrom(swappers.map(s => s.swapperGroup))
    .map(swapperGroup => {
      return swappers.find(s => s.swapperGroup === swapperGroup);
    })
    .find(s => {
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
    <Settings
      slippages={SLIPPAGES}
      selectedSlippage={slippage}
      onSlippageChange={slippage => setSlippage(slippage)}
      liquiditySources={uniqueSwappersGroups}
      selectedLiquiditySources={uniqueSwappersGroups.filter((s) => s.selected)}
      onLiquiditySourcesClick={navigate.bind(
        null,
        navigationRoutes.liquiditySources
      )}
      onBack={navigateBackFrom.bind(null, navigationRoutes.settings)}
      customSlippage={customSlippage || NaN}
      onCustomSlippageChange={setCustomSlippage}
      minSlippage={MIN_SLIPPGAE}
      maxSlippage={MAX_SLIPPAGE}
      selectedTheme={theme}
      onThemeChange={setTheme}
      infiniteApprove={infiniteApprove}
      toggleInfiniteApprove={toggleInfiniteApprove}
    />
  );
}
