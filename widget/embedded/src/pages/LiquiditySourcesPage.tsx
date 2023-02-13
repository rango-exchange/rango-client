import { Button, LiquiditySourcesSelector, styled } from '@rangodev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';

const ActionButton = styled(Button, {
  position: 'absolute',
  right: 0,
});

export function LiquiditySourcePage() {
  const {
    meta: { swappers },
  } = useMetaStore();
  const {
    disabledLiquiditySources,
    toggleLiquiditySource,
    clearDisabledLiquiditySource,
    disabledAllLiquiditySource,
  } = useSettingsStore();
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

  const resetAllOrSelectAll = () => {
    if (uniqueSwappersGroups.length - disabledLiquiditySources.length === 0)
      clearDisabledLiquiditySource();
    else {
      const swappers = uniqueSwappersGroups.map((swapper) => swapper.title);
      disabledAllLiquiditySource(swappers);
    }
  };

  return (
    <LiquiditySourcesSelector
      actionButton={
        <ActionButton variant="ghost" type="primary" onClick={resetAllOrSelectAll}>
          {uniqueSwappersGroups.length - disabledLiquiditySources.length === 0
            ? 'Select all'
            : 'Clear all'}
        </ActionButton>
      }
      list={uniqueSwappersGroups}
      onChange={(liquiditySource) => toggleLiquiditySource(liquiditySource.title)}
      onBack={() => {
        navigate(-1);
      }}
    />
  );
}
