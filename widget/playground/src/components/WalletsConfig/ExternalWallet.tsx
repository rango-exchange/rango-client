import React, { useEffect, useState } from 'react';
import { Button, Divider, Switch, Typography, styled } from '@rango-dev/ui';
import { WalletType, WalletTypes } from '@rango-dev/wallets-shared';
import { ProviderInterface } from '@rango-dev/wallets-core';
import { useConfigStore } from '../../store/config';
import * as metamask from '@rango-dev/provider-metamask';
import { useWallets } from '@rango-dev/widget-embedded';
import { excludedWallets } from '../../helpers';

const Head = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid $neutral100',
  paddingBottom: '$8',
});

const Body = styled('div', {
  maxHeight: 150,
  overflow: 'hidden auto',
});
export function ExternalWallet() {
  const [externalWallet, setExternalWallet] = useState<boolean>(false);
  const wallets = useConfigStore.use.config().wallets;
  const onChangeWallets = useConfigStore.use.onChangeWallets();
  const { state, connect, disconnect } = useWallets();

  const onChangeExternalWallet = (checked: boolean) => {
    let selectedWallets: (WalletType | ProviderInterface)[] = [
      ...(!wallets
        ? Object.values(WalletTypes)
            .filter((wallet) => !excludedWallets.includes(wallet))
            .filter((item) => {
              return item !== WalletTypes.META_MASK;
            })
            .map((item) => item)
        : wallets),
    ];
    if (checked) {
      const walletIndex = selectedWallets.findIndex(
        (w) => typeof w === 'string' && w === WalletTypes.META_MASK
      );
      if (walletIndex !== -1) selectedWallets.splice(walletIndex, 1);
      selectedWallets = [...selectedWallets, metamask];
    } else {
      const providerIndex = selectedWallets.findIndex(
        (w) => typeof w !== 'string' && w.config.type === WalletTypes.META_MASK
      );
      if (providerIndex !== -1) selectedWallets.splice(providerIndex, 1);
    }

    setExternalWallet(checked);
    onChangeWallets(!selectedWallets.length ? undefined : selectedWallets);
  };

  useEffect(() => {
    const providerIndex = wallets?.findIndex(
      (w) => typeof w !== 'string' && w.config.type === WalletTypes.META_MASK
    );
    if (!providerIndex || providerIndex === -1) setExternalWallet(false);
  }, [wallets]);

  return (
    <>
      <Head>
        <Typography noWrap variant="body2" color="neutral700">
          External Wallets
        </Typography>

        <Switch checked={externalWallet} onChange={onChangeExternalWallet} />
      </Head>
      <Divider size={16} />
      <Body>
        <Typography variant="body2">
          It's a sample using metamask, You can use your own wallet or what we
          alredy implemented, check it out here.
        </Typography>
        <Divider size={16} />

        <Button
          type="primary"
          disabled={!externalWallet}
          onClick={() => {
            if (state('metamask').connected) {
              disconnect('metamask');
            } else {
              connect('metamask');
            }
          }}>
          {state('metamask').connected
            ? 'disconnect metamsk'
            : 'connect metamsk'}
        </Button>
      </Body>
    </>
  );
}
