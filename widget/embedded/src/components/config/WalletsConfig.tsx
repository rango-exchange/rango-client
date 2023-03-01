import { Checkbox, Spacer, Typography } from '@rangodev/ui';
import { BlockchainMeta, TokenMeta } from '@rangodev/ui/dist/types/meta';
import React from 'react';
import { ConfigurationContainer } from './ChainsConfig';
import { MultiSelect } from './MultiSelect';
interface PropTypes {
  multiChain: boolean;
  onChange: (name: string, value: string | TokenMeta | BlockchainMeta | boolean) => void;
}
export function WalletsConfig({ multiChain, onChange }: PropTypes) {
  return (
    <>
      <Typography variant="h4">Wallet</Typography>
      <Spacer size={12} scale="vertical" />
      <ConfigurationContainer>
        <MultiSelect label="Supported Wallets" type="Wallests" modalTitle={''} />
        <Spacer scale="vertical" size={12} />
        <Checkbox
          onCheckedChange={(checked) => onChange('multiChain', checked)}
          id="custom_address"
          label="Enable multi wallets simultaneously"
          checked={multiChain}
        />
      </ConfigurationContainer>
    </>
  );
}
