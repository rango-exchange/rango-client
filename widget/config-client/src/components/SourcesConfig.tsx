import { Spacer, Typography } from '@rango-dev/ui';
import { LiquiditySource } from '@rango-dev/ui/dist/types/meta';
import React from 'react';
import { useConfigStore } from '../store/config';
import { useMetaStore } from '../store/meta';
import { ConfigurationContainer } from './ChainsConfig';
import { MultiSelect } from './MultiSelect';

export function SourcesConfig() {
  const {
    meta: { swappers },
    loadingStatus,
  } = useMetaStore();
  const { liquiditySources } = useConfigStore((state) => state.configs);
  const onChangeSources = useConfigStore((state) => state.onChangeSources);
  const uniqueSwappersGroups: Array<LiquiditySource> = [];
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
            selected: false,
          });
        }
      }
    });

  return (
    <>
      <Typography variant="h4">Liquidity sources</Typography>
      <Spacer size={12} direction="vertical" />
      <ConfigurationContainer>
        <MultiSelect
          label="Supported Sources"
          type="Sources"
          loading={loadingStatus === 'loading'}
          disabled={loadingStatus === 'failed'}
          modalTitle="Select Sources"
          list={uniqueSwappersGroups}
          onChange={onChangeSources}
          value={liquiditySources}
        />
      </ConfigurationContainer>
    </>
  );
}
