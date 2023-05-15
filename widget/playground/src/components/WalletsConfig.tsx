import { Checkbox, Divider, Typography } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-core';
import { WalletType } from '@rango-dev/wallets-shared';
import React from 'react';
import { excludedWallets, onChangeMultiSelects } from '../helpers';
import { useConfigStore } from '../store/config';
import { ConfigurationContainer } from './ChainsConfig';
import { MultiSelect } from './MultiSelect';

export function WalletsConfig() {
  const { getWalletInfo } = useWallets();

  const wallets = useConfigStore.use.config().wallets;
  const multiWallets = useConfigStore.use.config().multiWallets;

  const onChangeWallets = useConfigStore.use.onChangeWallets();
  const onChangeBooleansConfig = useConfigStore.use.onChangeBooleansConfig();

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
    const values = onChangeMultiSelects(wallet, wallets, list, (item) => item === wallet);
    onChangeWallets(values);
  };

  return (
    <>
      <Typography variant="h6">Wallet</Typography>
      <Divider size={12} />
      <ConfigurationContainer>
        <MultiSelect
          label="Supported Wallets"
          type="Wallets"
          modalTitle="Select Wallets"
          list={walletList}
          value={wallets}
          onChange={onChange}
        />
        <Divider size={24} />
        <Checkbox
          onCheckedChange={(checked) => onChangeBooleansConfig('multiWallets', checked)}
          id="multi_wallets"
          label="Enable Multi Wallets Simultaneously"
          checked={multiWallets === undefined ? true : multiWallets}
        />
      </ConfigurationContainer>
    </>
  );
}
