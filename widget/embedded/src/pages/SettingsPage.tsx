import React from 'react';
import { Settings } from '@rangodev/ui';
import { useSettingsStore } from '../store/settings';
import { useMetaStore } from '../store/meta';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';

export function SettingsPage() {
  const {
    slippage,
    setSlippage,
    disabledLiquiditySources,
    customSlippage,
    setCustomSlippage,
    theme,
    setTheme,
  } = useSettingsStore();
  const {
    meta: { swappers },
  } = useMetaStore();
  const navigate = useNavigate();

  const uniqueSwappersGroups: Array<{
    title: string;
    logo: string;
    type: 'BRIDGE' | 'AGGREGATOR' | 'DEX';
    selected: boolean;
  }> = [];
  Array.from(new Set(swappers.map((s) => s.swapperGroup)))
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
      onLiquiditySourcesClick={() => navigate(navigationRoutes.liquiditySources.split('/')[1])}
      onBack={navigate.bind(null, navigationRoutes.home)}
      customSlippage={customSlippage || NaN}
      onCustomSlippageChange={setCustomSlippage}
      minSlippage={1}
      maxSlippage={10}
      selectedTheme={theme}
      onThemeChange={setTheme}
    />
  );
}
