import type { WalletType } from '@rango-dev/wallets-shared';

import { allProviders as getAllProviders } from '@rango-dev/provider-all';
import {
  Button,
  Checkbox,
  Divider,
  Switch,
  Typography,
  WalletIcon,
} from '@rango-dev/ui';
import { getAllLegacyProviders } from '@rango-dev/wallets-react';
import { WalletTypes } from '@rango-dev/wallets-shared';
import { useWallets } from '@rango-dev/widget-embedded';
import React from 'react';

import { MultiSelect } from '../../components/MultiSelect';
import { useConfigStore } from '../../store/config';
import { useMetaStore } from '../../store/meta';
import { getCategoryNetworks } from '../../utils/blockchains';
import { excludedWallets } from '../../utils/common';

import {
  connectButtonStyles,
  ExternalSection,
  Footer,
  SwitchField,
} from './FunctionalLayout.styles';

export function WalletSection() {
  const { state, connect, disconnect } = useWallets();
  const { onChangeWallets, onChangeBooleansConfig, config } = useConfigStore();
  const {
    meta: { blockchains },
  } = useMetaStore();

  const getWalletsList = () => {
    const envs = {
      walletconnect2: {
        WC_PROJECT_ID: config?.walletConnectProjectId || '',
        DISABLE_MODAL_AND_OPEN_LINK:
          config.__UNSTABLE_OR_INTERNAL__?.walletConnectListedDesktopWalletLink,
      },
      selectedProviders: config.wallets,
      trezor: config?.trezorManifest
        ? { manifest: config.trezorManifest }
        : undefined,
      tonConnect: config?.tonConnect?.manifestUrl
        ? { manifestUrl: config?.tonConnect.manifestUrl }
        : undefined,
    };
    const allProviders = getAllProviders(envs);
    const allBuiltProviders = allProviders.map((build) => build());
    const legacyProviders = getAllLegacyProviders(allBuiltProviders);
    const filteredProviders = legacyProviders.filter(
      (provider) =>
        !excludedWallets.includes(provider.config.type as WalletTypes)
    );

    const allWalletList = filteredProviders.map((provider) => {
      const walletInfo = provider.getWalletInfo(blockchains);
      return {
        title: walletInfo.name,
        logo: walletInfo.img,
        name: provider.config.type,
        supportedNetworks: getCategoryNetworks(walletInfo.supportedChains),
      };
    });

    return allWalletList;
  };

  const { externalWallets, wallets, multiWallets } = config;
  const allWalletList = getWalletsList();

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
