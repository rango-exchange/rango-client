import React from 'react';
import { Settings } from '@rangodev/ui';
import { useSettingsStore } from '../store/settings';
import { useMetaStore } from '../store/meta';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';
import { removeDuplicateFrom } from '../utils/common';

export function SettingsPage() {
  const slippage = useSettingsStore.use.slippage();
  const setSlippage = useSettingsStore.use.setSlippage();
  const disabledLiquiditySources = useSettingsStore.use.disabledLiquiditySources();
  const customSlippage = useSettingsStore.use.customSlippage();
  const setCustomSlippage = useSettingsStore.use.setCustomSlippage();
  const theme = useSettingsStore.use.theme();
  const setTheme = useSettingsStore.use.setTheme();
  const { swappers } = useMetaStore.use.meta();
  const navigate = useNavigate();

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
    <Settings
      slippages={[1, 2, 3, 4]}
      selectedSlippage={slippage}
      onSlippageChange={(slippage) => setSlippage(slippage)}
      liquiditySources={uniqueSwappersGroups}
      selectedLiquiditySources={uniqueSwappersGroups.filter((s) => s.selected)}
      onLiquiditySourcesClick={() => navigate(navigationRoutes.liquiditySources)}
      onBack={navigate.bind(null, -1)}
      customSlippage={customSlippage || NaN}
      onCustomSlippageChange={setCustomSlippage}
      minSlippage={1}
      maxSlippage={10}
      selectedTheme={theme}
      onThemeChange={setTheme}
    />
  );
}
