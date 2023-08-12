import React from 'react';
import { useWallets } from '@rango-dev/wallets-react';
import { WalletTypes, WalletType } from '@rango-dev/wallets-shared';
import { excludedWallets, onChangeMultiSelects } from '../../helpers';
import { useConfigStore } from '../../store/config';
import { MultiSelect } from '../MultiSelect';

export function InternalWallets({
  onChangeWallets,
}: {
  onChangeWallets: (values: WalletType[] | undefined) => void;
}) {
  const { getWalletInfo } = useWallets();
  const wallets = useConfigStore.use.config().wallets;

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
    const values = onChangeMultiSelects(
      wallet,
      wallets,
      list,
      (item: WalletType) => item === wallet
    );

    onChangeWallets(values);
  };

  return (
    <MultiSelect
      label="Supported Wallets"
      type="Wallets"
      modalTitle="Select Wallets"
      list={walletList}
      value={wallets as WalletType[]}
      onChange={onChange}
    />
  );
}
