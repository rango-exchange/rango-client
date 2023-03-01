import { Checkbox, Spacer, Typography } from '@rangodev/ui';
import { useWallets } from '@rangodev/wallets-core';
import { WalletType } from '@rangodev/wallets-shared';
import React from 'react';
import { excludedWallets } from '../helpers';
import { ConfigType } from '../types';
import { ConfigurationContainer } from './ChainsConfig';
import { MultiSelect } from './MultiSelect';
interface PropTypes {
  onChange: (name: string, value: 'all' | WalletType[] | boolean) => void;
  config: ConfigType;
}
export function WalletsConfig({ onChange, config }: PropTypes) {
  const { getWalletInfo } = useWallets();

  const wallets = Object.values(WalletType)
    .filter((wallet) => !excludedWallets.includes(wallet))
    .map((type) => {
      const { name: title, img: logo } = getWalletInfo(type);
      return {
        title,
        logo,
        type,
      };
    });

  return (
    <>
      <Typography variant="h4">Wallet</Typography>
      <Spacer size={12} direction="vertical" />
      <ConfigurationContainer>
        <MultiSelect
          label="Supported Wallets"
          type="Wallests"
          modalTitle="Select Wallets"
          list={wallets}
          name="wallets"
          value={config.wallets}
          onChange={onChange}
        />
        <Spacer direction="vertical" size={12} />
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
