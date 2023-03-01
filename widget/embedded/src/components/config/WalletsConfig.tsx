import { Checkbox, Spacer, Typography } from '@rangodev/ui';
import React from 'react';
import { ConfigurationContainer } from './ChainsConfig';
import { MultiSelect } from './MultiSelect';

export function WalletsConfig() {
  return (
    <>
      <Typography variant="h4">Wallet</Typography>
      <Spacer size={12} scale="vertical" />
      <ConfigurationContainer>
        <MultiSelect label="Supported Wallets" type="Wallests" />
        <Spacer scale="vertical" size={12} />
        <Checkbox id="custom_address" label="Enable multi wallets simultaneously" checked />
      </ConfigurationContainer>
    </>
  );
}
