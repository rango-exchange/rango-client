import { Button, LiquiditySourcesSelector, styled } from '@rangodev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';

export function LiquiditySourcePage() {
  const {
    meta: { swappers },
  } = useMetaStore();
  const { disabledLiquiditySources, toggleLiquiditySource, toggleAllLiquiditySources } =
    useSettingsStore();
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

  const toggleAll = () => {
    if (uniqueSwappersGroups.length - disabledLiquiditySources.length === 0)
      toggleAllLiquiditySources([]);
    else {
      const swappers = uniqueSwappersGroups.map((swapper) => swapper.title);
      toggleAllLiquiditySources(swappers);
    }
  };

  return (
    <LiquiditySourcesSelector
      toggleAll={toggleAll}
      allSelected = {uniqueSwappersGroups.length - disabledLiquiditySources.length === 0}
      list={uniqueSwappersGroups}
      onChange={(liquiditySource) => toggleLiquiditySource(liquiditySource.title)}
      onBack={() => {
        navigate(-1);
      }}
    />
  );
}
