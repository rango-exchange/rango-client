import React from 'react';
import { Checkbox, Divider, Typography } from '@rango-dev/ui';
import { Provider } from '@rango-dev/wallets-core';
import { ConfigurationContainer } from '../ChainsConfig';
import { ExternalWallet } from './ExternalWallet';
import { allProviders } from '@rango-dev/provider-all';
import { useConfigStore } from '../../store/config';
import { InternalWallets } from './InternalWallets';
const providers = allProviders();

export function WalletsConfig() {
  const multiWallets = useConfigStore.use.config().multiWallets;

  const onChangeBooleansConfig = useConfigStore.use.onChangeBooleansConfig();

  return (
    <>
      <Typography variant="h6">Wallet</Typography>
      <Divider size={12} />
      <ConfigurationContainer>
        <Provider providers={providers}>
          <InternalWallets />
        </Provider>
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
        <ExternalWallet />
      </ConfigurationContainer>
    </>
  );
}
