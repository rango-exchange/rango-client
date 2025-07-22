import type { WalletType } from '@arlert-dev/wallets-shared';

import {
  Button,
  Checkbox,
  Divider,
  Switch,
  Typography,
  WalletIcon,
} from '@arlert-dev/ui';
import { WalletTypes } from '@arlert-dev/wallets-shared';
import { useWallets } from '@arlert-dev/widget-embedded';
import React from 'react';

import { MultiSelect } from '../../components/MultiSelect';
import { useConfigStore } from '../../store/config';
import { useMetaStore } from '../../store/meta';

import {
  connectButtonStyles,
  ExternalSection,
  Footer,
  SwitchField,
} from './FunctionalLayout.styles';
import { getWalletsList } from './FunctionalLayout.utils';

export function WalletSection() {
  const { state, connect, disconnect } = useWallets();
  const { onChangeWallets, onChangeBooleansConfig, config } = useConfigStore();
  const {
    meta: { blockchains },
  } = useMetaStore();

  const { externalWallets, wallets, multiWallets } = config;
  const allWalletList = getWalletsList(config, blockchains);

  const onChangeExternalWallet = (checked: boolean) => {
    if (!checked) {
      if (state('metamask').connected) {
        void disconnect(WalletTypes.META_MASK);
      }
    }
    onChangeBooleansConfig('externalWallets', checked);
  };

  const isSelectAllWallets =
    wallets?.length === allWalletList.length || externalWallets;

  return (
    <>
      <MultiSelect
        label="Supported Wallets"
        icon={<WalletIcon />}
        type="Wallets"
        value={isSelectAllWallets ? undefined : (wallets as WalletType[])}
        defaultSelectedItems={
          (wallets as WalletType[]) ||
          allWalletList.map((wallet) => wallet.name)
        }
        list={allWalletList}
        disabled={!!externalWallets}
        onChange={onChangeWallets}
      />
      <Divider size={24} />
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
            color="neutral700">
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
        <Typography size="small" variant="body" color="neutral600">
          It's a sample using metamask, You can use your own wallet or what we
          already implemented, check it out here.
        </Typography>
        <Divider size={16} />
        <Footer>
          <Button
            id="external-wallets"
            type={externalWallets ? 'primary' : 'secondary'}
            size="small"
            variant="outlined"
            disabled={!externalWallets}
            className={connectButtonStyles()}
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
        </Footer>
      </ExternalSection>
    </>
  );
}
