import type { ProviderInterface } from '@rango-dev/wallets-react';
import type { WalletType } from '@rango-dev/wallets-shared';

import { Button, Checkbox, Divider, Switch, Typography } from '@rango-dev/ui';
import { WalletTypes } from '@rango-dev/wallets-shared';
import { useWallets } from '@rango-dev/widget-embedded';
import React from 'react';

import { NOT_FOUND } from '../../constants';
import { useConfigStore } from '../../store/config';

import { ExternalSection, SwitchField } from './FunctionalLayout.styles';

export function Wallets() {
  const multiWallets = useConfigStore.use.config().multiWallets;
  const wallets = useConfigStore.use.config().wallets;
  const externalWallets = useConfigStore.use.config().externalWallets;
  const { state, connect, disconnect } = useWallets();
  const onChangeWallets = useConfigStore.use.onChangeWallets();
  const onChangeBooleansConfig = useConfigStore.use.onChangeBooleansConfig();

  const onChangeExternalWallet = (checked: boolean) => {
    let selectedWallets: (WalletType | ProviderInterface)[] = !!wallets
      ? [...wallets]
      : [];
    if (checked) {
      const index = selectedWallets.findIndex(
        (wallet) => wallet === WalletTypes.META_MASK
      );
      if (index !== NOT_FOUND) {
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

  return (
    <>
      <Checkbox
        id="multi"
        onCheckedChange={(checked: boolean) =>
          onChangeBooleansConfig('multiWallets', checked)
        }
        checked={multiWallets ?? true}
        label={
          <Typography
            style={{
              fontWeight: 500,
            }}
            size="small"
            variant="body"
            color="neutral900">
            Enable Multi Wallets Simultaneously
          </Typography>
        }
      />
      <Divider size={24} />
      <ExternalSection>
        <SwitchField>
          <Typography size="large" variant="label" color="secondary500">
            External Wallets
          </Typography>
          <Switch
            onChange={onChangeExternalWallet}
            checked={externalWallets ?? false}
          />
        </SwitchField>
        <Divider size={16} />
        <Typography size="small" variant="body" color="neutral800">
          It's a sample using metamask, You can use your own wallet or what we
          alredy implemented, check it out here.
        </Typography>
        <Divider size={16} />
        <div className="footer">
          <Button
            type={externalWallets ? 'primary' : 'secondary'}
            size="small"
            variant="outlined"
            style={{
              padding: '5px 20px',
            }}
            disabled={!externalWallets}
            onClick={() => {
              if (state('metamask').connected) {
                void disconnect('metamask');
              } else {
                void connect('metamask');
              }
            }}>
            {externalWallets && state('metamask').connected
              ? 'Disconnect MetaMask'
              : 'Connect MetaMask'}
          </Button>
        </div>
      </ExternalSection>
    </>
  );
}
