import React from 'react';
import { Checkbox, Divider, Typography } from '@rango-dev/ui';
import { Provider } from '@rango-dev/wallets-react';
import { ConfigurationContainer } from '../ChainsConfig';
import { ExternalWallet } from './ExternalWallet';
import { allProviders } from '@rango-dev/provider-all';
import { useConfigStore } from '../../store/config';
import { InternalWallets } from './InternalWallets';
import { WalletType } from '@rango-dev/wallets-shared';
import { WC_PROJECT_ID } from '../../configs';

const providers = allProviders({
  walletconnect2: {
    WC_PROJECT_ID: WC_PROJECT_ID,
  },
});

export function WalletsConfig() {
  const multiWallets = useConfigStore.use.config().multiWallets;

  const onChangeBooleansConfig = useConfigStore.use.onChangeBooleansConfig();
  const onChangeWallets = useConfigStore.use.onChangeWallets();

  const onChange = (values?: WalletType[] | undefined) => {
    onChangeWallets(values);
  };
  return (
    <>
      <Typography variant="h6">Wallet</Typography>
      <Divider size={12} />
      <ConfigurationContainer>
        <Provider providers={providers}>
          <InternalWallets onChangeWallets={onChange} />
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
