import { Spacer, Typography } from '@rangodev/ui';
import { LiquiditySource } from '@rangodev/ui/dist/types/meta';
import React from 'react';
import { useMetaStore } from '../../store/meta';
import { ConfigType, Value } from '../../types/config';
import { ConfigurationContainer } from './ChainsConfig';
import { MultiSelect } from './MultiSelect';

interface PropTypes {
  onChange: (name: string, value: Value) => void;
  config: ConfigType;
}
export function SourcesConfig({ onChange, config }: PropTypes) {
  const {
    meta: { swappers },
    loadingStatus,
  } = useMetaStore();

  const uniqueSwappersGroups: Array<LiquiditySource> = [];
  Array.from(new Set(swappers.map(s => s.swapperGroup)))
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
            selected: false,
          });
        }
      }
    });

  return (
    <>
      <Typography variant="h4">Liquidity sources</Typography>
      <Spacer size={12} scale="vertical" />
      <ConfigurationContainer>
        <MultiSelect
          label="Supported Sources"
          type="Sources"
          loading={loadingStatus === 'loading'}
          disabled={loadingStatus === 'failed'}
          modalTitle="Select Sources"
          list={uniqueSwappersGroups}
          onChange={onChange}
          name="liquiditySources"
          value={config.liquiditySources}
        />
      </ConfigurationContainer>
    </>
  );
}
