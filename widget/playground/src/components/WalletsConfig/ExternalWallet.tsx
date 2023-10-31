import type { ProviderInterface } from '@rango-dev/wallets-react';
import type { WalletType } from '@rango-dev/wallets-shared';

import { Button, Divider, styled, Switch, Typography } from '@rango-dev/ui';
import { WalletTypes } from '@rango-dev/wallets-shared';
import { useWallets } from '@rango-dev/widget-embedded';
import React, { useEffect } from 'react';

import { useConfigStore } from '../../store/config';

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
  const externalWallets = useConfigStore.use.config().externalWallets;
  const wallets = useConfigStore.use.config().wallets;
  const onChangeWallets = useConfigStore.use.onChangeWallets();
  const { state, connect, disconnect } = useWallets();
  const onChangeBooleansConfig = useConfigStore.use.onChangeBooleansConfig();

  const onChangeExternalWallet = (checked: boolean) => {
    let selectedWallets: (WalletType | ProviderInterface)[] = !!wallets
      ? [...wallets]
      : [];
    if (checked) {
      const index = selectedWallets.findIndex(
        (wallet) => wallet === WalletTypes.META_MASK
      );
      if (index !== -1) {
        selectedWallets.splice(index, 1);
      }
      selectedWallets = [...selectedWallets, WalletTypes.META_MASK];
    } else {
      if (state('metamask').connected) {
        void disconnect(WalletTypes.META_MASK);
      }
      if (selectedWallets.length === 1) {
        selectedWallets = [];
      }
    }

    onChangeBooleansConfig('externalWallets', checked);
    onChangeWallets(!selectedWallets.length ? undefined : selectedWallets);
  };

  useEffect(() => {
    const providerIndex = wallets?.findIndex(
      (wallet) => wallet === WalletTypes.META_MASK
    );

    if (providerIndex === -1) {
      onChangeBooleansConfig('externalWallets', false);
    }
  }, [wallets]);

  return (
    <>
      <Head>
        <Typography noWrap variant="body" size="small" color="neutral900">
          External Wallets
        </Typography>

        <Switch
          checked={externalWallets ?? false}
          onChange={onChangeExternalWallet}
        />
      </Head>
      <Divider size={16} />
      <Body>
        <Typography variant="body" size="small">
          It's a sample using metamask, You can use your own wallet or what we
          alredy implemented, check it out here.
        </Typography>
        <Divider size={16} />

        <Button
          type="primary"
          disabled={!externalWallets}
          onClick={() => {
            if (state('metamask').connected) {
              void disconnect('metamask');
            } else {
              void connect('metamask');
            }
          }}>
          {externalWallets && state('metamask').connected
            ? 'disconnect metamsk'
            : 'connect metamsk'}
        </Button>
      </Body>
    </>
  );
}
