import { LiquiditySourcesSelector } from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { removeDuplicateFrom } from '../utils/common';

export function LiquiditySourcePage() {
  const { swappers } = useMetaStore.use.meta();
  const toggleLiquiditySource = useSettingsStore.use.toggleLiquiditySource();
  const disabledLiquiditySources = useSettingsStore.use.disabledLiquiditySources();
  const toggleAllLiquiditySources = useSettingsStore.use.toggleAllLiquiditySources();

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
    <LiquiditySourcesSelector
      toggleAll={toggleAllLiquiditySources}
      list={uniqueSwappersGroups}
      onChange={(liquiditySource) => toggleLiquiditySource(liquiditySource.title)}
      onBack={() => {
        navigate(-1);
      }}
    />
  );
}
