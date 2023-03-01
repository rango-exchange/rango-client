import { Checkbox, Spacer, Typography } from '@rangodev/ui';
import { WalletType } from '@rangodev/wallets-shared';
import React from 'react';
import { ConfigType } from '../../types/config';
import { ConfigurationContainer } from './ChainsConfig';
import { Wallets } from './mock';
import { MultiSelect } from './MultiSelect';
interface PropTypes {
  onChange: (name: string, value:  WalletType[] | boolean) => void;
  config: ConfigType;
}
export function WalletsConfig({ onChange, config }: PropTypes) {
  return (
    <>
      <Typography variant="h4">Wallet</Typography>
      <Spacer size={12} scale="vertical" />
      <ConfigurationContainer>
        <MultiSelect
          label="Supported Wallets"
          type="Wallests"
          modalTitle="Select Wallets"
          list={Wallets}
          name="wallets"
          value={config.wallets}
          onChange={onChange}
        />
        <Spacer scale="vertical" size={12} />
        <Checkbox
          onCheckedChange={(checked) => onChange('multiChain', checked)}
          id="multi_wallets"
          label="Enable multi wallets simultaneously"
          checked={config.multiChain}
        />
      </ConfigurationContainer>
    </>
  );
}
