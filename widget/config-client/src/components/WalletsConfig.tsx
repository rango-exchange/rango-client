import { Checkbox, Spacer, Typography } from '@rangodev/ui';
import { useWallets } from '@rangodev/wallets-core';
import { WalletType } from '@rangodev/wallets-shared';
import React from 'react';
import { excludedWallets } from '../helpers';
import { useConfigStore } from '../store/config';
import { ConfigurationContainer } from './ChainsConfig';
import { MultiSelect } from './MultiSelect';

export function WalletsConfig() {
  const { getWalletInfo } = useWallets();
  const { wallets, onChangeWallets, multiChain, onChangeBooleansConfig } = useConfigStore(
    (state) => state,
  );
  const walletList = Object.values(WalletType)
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
          type="Wallets"
          modalTitle="Select Wallets"
          list={walletList}
          value={wallets}
          onChange={onChangeWallets}
        />
        <Spacer direction="vertical" size={12} />
        <Checkbox
          onCheckedChange={(checked) => onChangeBooleansConfig('multiChain', checked)}
          id="multi_wallets"
          label="Enable multi wallets simultaneously"
          checked={multiChain}
        />
      </ConfigurationContainer>
    </>
  );
}
