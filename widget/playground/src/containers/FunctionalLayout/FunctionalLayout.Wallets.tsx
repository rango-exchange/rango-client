import type { WalletType } from '@rango-dev/wallets-shared';
import type { WidgetConfig } from '@rango-dev/widget-embedded';

import {
  Checkbox,
  Divider,
  Switch,
  Typography,
  WalletIcon,
} from '@rango-dev/ui';
import { WalletTypes } from '@rango-dev/wallets-shared';
import { useWallets } from '@rango-dev/widget-embedded';
import React from 'react';

import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { NOT_FOUND } from '../../constants';
import { useConfigStore } from '../../store/config';
import { getCategoryNetworks } from '../../utils/blockchains';
import { excludedWallets } from '../../utils/common';

import {
  ExternalSection,
  StyledButton,
  SwitchField,
} from './FunctionalLayout.styles';

export function WalletSection() {
  const { state, connect, disconnect, getWalletInfo } = useWallets();
  const {
    onChangeWallets,
    onChangeBooleansConfig,
    config: { externalWallets, wallets, multiWallets },
  } = useConfigStore();

  const allWalletList = Object.values(WalletTypes)
    .filter((wallet) => !excludedWallets.includes(wallet))
    .map((wallet) => {
      const { name: title, img: logo, supportedChains } = getWalletInfo(wallet);
      return {
        title,
        logo,
        name: wallet,
        networks: getCategoryNetworks(supportedChains),
      };
    });

  const onChangeExternalWallet = (checked: boolean) => {
    let selectedWallets: WidgetConfig['wallets'] = !!wallets
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
      <MultiSelect
        label="Supported Wallets"
        icon={<WalletIcon />}
        type="Wallets"
        value={
          wallets?.length === allWalletList.length
            ? undefined
            : (wallets as WalletType[])
        }
        defaultSelectedItems={
          (wallets as WalletType[]) ||
          allWalletList.map((wallet) => wallet.name)
        }
        list={allWalletList}
        onChange={(items) => onChangeWallets(items)}
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
        <div className="footer">
          <StyledButton
            type={externalWallets ? 'primary' : 'secondary'}
            size="small"
            variant="outlined"
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
          </StyledButton>
        </div>
      </ExternalSection>
    </>
  );
}
