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
import React, { useState } from 'react';

import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { OverlayPanel } from '../../components/OverlayPanel';
import { SupportedWallets } from '../../components/SupportedWallets';
import { NOT_FOUND } from '../../constants';
import { excludedWallets, getWalletNetworks } from '../../helpers';
import { useConfigStore } from '../../store/config';

import {
  ExternalSection,
  StyledButton,
  SwitchField,
} from './FunctionalLayout.styles';

export function WalletSection() {
  const [showNextModal, setShowNextModal] = useState(false);
  const { state, connect, disconnect, getWalletInfo } = useWallets();
  const {
    onChangeWallets,
    onChangeBooleansConfig,
    config: { externalWallets, wallets, multiWallets },
  } = useConfigStore();

  const allWalletList = Object.values(WalletTypes)
    .filter((wallet) => !excludedWallets.includes(wallet))
    .map((type) => {
      const { name: title, img: logo, supportedChains } = getWalletInfo(type);
      return {
        title,
        logo,
        type,
        networks: getWalletNetworks(supportedChains),
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

  const onBack = () => setShowNextModal(false);

  return (
    <>
      <MultiSelect
        label="Supported Wallets"
        icon={<WalletIcon />}
        type="Wallets"
        onClick={() => setShowNextModal(true)}
        value={
          wallets?.length === allWalletList.length
            ? undefined
            : (wallets as WalletType[])
        }
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
      {showNextModal && (
        <OverlayPanel onBack={onBack}>
          <SupportedWallets
            onBack={onBack}
            configWallets={
              wallets || allWalletList.map((wallet) => wallet.type)
            }
            allWallets={allWalletList}
          />
        </OverlayPanel>
      )}
    </>
  );
}
