import React from 'react';
import { Checkbox, Divider, Typography } from '@rango-dev/ui';
import { ProviderInterface, useWallets } from '@rango-dev/wallets-core';
import { WalletTypes, WalletType } from '@rango-dev/wallets-shared';
import { excludedWallets, onChangeMultiSelects } from '../helpers';
import { useConfigStore } from '../store/config';
import { ConfigurationContainer } from './ChainsConfig';
import { MultiSelect } from './MultiSelect';
import { ProvidersMultiSelect } from './MultiSelect/providers';

export function WalletsConfig() {
  const { getWalletInfo } = useWallets();
  const allWallets = useConfigStore.use.config().wallets;
  const wallets = allWallets?.filter((w) => typeof w === 'string');
  const providers = allWallets?.filter((w) => typeof w !== 'string');

  const multiWallets = useConfigStore.use.config().multiWallets;

  const onChangeWallets = useConfigStore.use.onChangeWallets();
  const onChangeBooleansConfig = useConfigStore.use.onChangeBooleansConfig();

  const walletList = Object.values(WalletTypes)
    .filter((wallet) => !excludedWallets.includes(wallet))
    .map((type) => {
      const { name: title, img: logo } = getWalletInfo(type);
      return {
        title,
        logo,
        type,
      };
    });

  const onChange = (wallet: WalletType) => {
    const list = walletList.map((item) => item.type);
    const values =
      onChangeMultiSelects(
        wallet,
        wallets,
        list,
        (item: WalletType) => item === wallet
      ) || [];
    const p =
      providers?.filter(
        (p) => !values.includes((p as ProviderInterface).config.type)
      ) || [];
    if (wallet === 'all' || values === 'all') {
      onChangeWallets(undefined);
      return;
    } else if (wallet === 'empty') {
      onChangeWallets(p);
      return;
    }

    const result = [...p, ...values];

    onChangeWallets(!result.length ? undefined : result);
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
          value={wallets as WalletType[]}
          onChange={onChange}
        />
        <Divider size={24} />
        <Checkbox
          onCheckedChange={(checked: boolean) =>
            onChangeBooleansConfig('multiWallets', checked)
          }
          id="multi_wallets"
          label="Enable Multi Wallets Simultaneously"
          checked={multiWallets === undefined ? true : multiWallets}
        />
        <Divider size={24} />

        <ProvidersMultiSelect list={walletList} />
        <Divider size={24} />
      </ConfigurationContainer>
    </>
  );
}
