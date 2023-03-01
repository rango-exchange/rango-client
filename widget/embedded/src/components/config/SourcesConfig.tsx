import { Checkbox, Spacer, Typography } from '@rangodev/ui';
import React from 'react';
import { ConfigurationContainer } from './ChainsConfig';
import { MultiSelect } from './MultiSelect';

export function SourcesConfig() {
  return (
    <>
      <Typography variant="h4">Liquidity sources</Typography>
      <Spacer size={12} scale="vertical" />
      <ConfigurationContainer>
        <MultiSelect label="Supported Sources" type="Sources" />
        <Spacer scale="vertical" size={12} />
        <Checkbox id="custom_address" label="Enable multi wallets simultaneously" checked />
      </ConfigurationContainer>
    </>
  );
}
