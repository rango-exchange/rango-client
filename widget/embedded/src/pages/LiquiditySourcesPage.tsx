import { LiquiditySourcesSelector } from '@rangodev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';

export function LiquiditySourcePage() {
  const {
    meta: { swappers },
  } = useMetaStore();
  const { disabledLiquiditySources, toggleLiquiditySource } = useSettingsStore();
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
    <LiquiditySourcesSelector
      list={uniqueSwappersGroups}
      onChange={(liquiditySource) => toggleLiquiditySource(liquiditySource.title)}
      onBack={() => {
        navigate(-1);
      }}
    />
  );
}
