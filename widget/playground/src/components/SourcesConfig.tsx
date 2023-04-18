import { Spacer, Typography } from '@rango-dev/ui';
import { LiquiditySource } from '@rango-dev/ui/dist/types/meta';
import React from 'react';
import { onChangeMultiSelects } from '../helpers';
import { useConfigStore } from '../store/config';
import { useMetaStore } from '../store/meta';
import { ConfigurationContainer } from './ChainsConfig';
import { MultiSelect } from './MultiSelect';

export function SourcesConfig() {
  const swappers = useMetaStore.use.meta().swappers;
  const liquiditySources = useConfigStore.use.config().liquiditySources;
  const onChangeSources = useConfigStore.use.onChangeSources();
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
  const onChange = (source) => {
    const SourceList = uniqueSwappersGroups.map((s) => s.title);

    const values = onChangeMultiSelects(
      source,
      liquiditySources,
      SourceList,
      (item) => item === source,
    );

    onChangeSources(values);
  };
  return (
    <>
      <Typography variant="h4">Liquidity sources</Typography>
      <Spacer size={12} direction="vertical" />
      <ConfigurationContainer>
        <MultiSelect
          label="Supported Sources"
          type="Sources"
          modalTitle="Select Sources"
          list={uniqueSwappersGroups}
          onChange={onChange}
          value={liquiditySources}
        />
      </ConfigurationContainer>
    </>
  );
}
