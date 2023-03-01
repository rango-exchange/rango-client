import { Spacer, Typography } from '@rangodev/ui';
import React from 'react';
import { ConfigType } from '../../types/config';
import { ConfigurationContainer } from './ChainsConfig';
import { liquiditySources } from './mock';
import { MultiSelect } from './MultiSelect';

interface PropTypes {
  onChange: (name: string, value: string[]) => void;
  config: ConfigType;
}
export function SourcesConfig({ onChange, config }: PropTypes) {
  return (
    <>
      <Typography variant="h4">Liquidity sources</Typography>
      <Spacer size={12} scale="vertical" />
      <ConfigurationContainer>
        <MultiSelect
          label="Supported Sources"
          type="Sources"
          modalTitle="Select Sources"
          list={liquiditySources}
          onChange={onChange}
          name="liquiditySources"
          value={config.liquiditySources}
        />
      </ConfigurationContainer>
    </>
  );
}
