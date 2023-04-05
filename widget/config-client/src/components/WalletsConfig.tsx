import { Checkbox, Spacer, Typography } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-core';
import { WalletType } from '@rango-dev/wallets-shared';
import React from 'react';
import { excludedWallets, onChangeMultiSelects } from '../helpers';
import { useConfigStore } from '../store/config';
import { ConfigurationContainer } from './ChainsConfig';
import { MultiSelect } from './MultiSelect';

export function WalletsConfig() {
  const { getWalletInfo } = useWallets();
  const { configs, onChangeWallets, onChangeBooleansConfig } = useConfigStore((state) => state);
  const { wallets, multiChain } = configs;
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

  const onChange = (wallet) => {
    const list = walletList.map((item) => item.type);
    const values = onChangeMultiSelects(wallet, wallets, list, (item) => item === wallet.type);
    onChangeWallets(values);
  };

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
          onChange={onChange}
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
