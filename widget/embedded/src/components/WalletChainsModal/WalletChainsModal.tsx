import type { PropTypes } from './WalletChainsModal.types';

import { i18n } from '@lingui/core';
import {
  Button,
  Checkbox,
  Image,
  ListItemButton,
  MessageBox,
} from '@rango-dev/ui';
import {
  ChainTypes,
  WALLET_SUPPORTED_CHAIN_TYPES,
} from '@rango-dev/wallets-shared';
import React, { useState } from 'react';

import { WIDGET_UI_ID } from '../../constants';
import { WatermarkedModal } from '../common/WatermarkedModal';
import { WalletImageContainer } from '../HeaderButtons/HeaderButtons.styles';
import {
  LogoContainer,
  Spinner,
} from '../WalletModal/WalletModalContent.styles';

import { ChainTypesList } from './WalletChainsModal.styles';

const chainTypeItems = [
  { title: 'Solana', value: ChainTypes.SOLANA },
  { title: 'EVM', value: ChainTypes.EVM },
  { title: 'Cosmos', value: ChainTypes.COSMOS },
  { title: 'UTXO', value: ChainTypes.UTXO },
  { title: 'Starknet', value: ChainTypes.STARKNET },
  { title: 'Tron', value: ChainTypes.TRON },
];

export const WalletChainsModal = (props: PropTypes) => {
  const {
    open,
    onClose,
    onConfirm,
    selectedWalletType,
    selectedWalletImage,
    requiredChainType,
  } = props;
  const [selectedChainTypes, setSelectedChainTypes] = useState<ChainTypes[]>(
    requiredChainType ? [requiredChainType] : []
  );

  const selectedWalletSupportedChainTypes = WALLET_SUPPORTED_CHAIN_TYPES.find(
    (walletSupportedChainTypes) =>
      walletSupportedChainTypes.walletType === selectedWalletType
  )?.chainTypes;

  const selectedWalletChainTypeItems = !!selectedWalletSupportedChainTypes
    ? chainTypeItems.filter((chainTypeItem) =>
        selectedWalletSupportedChainTypes.includes(chainTypeItem.value)
      )
    : chainTypeItems;

  const handleChainTypeClick = (value: ChainTypes) =>
    setSelectedChainTypes((selectedChainTypes) =>
      selectedChainTypes.includes(value)
        ? selectedChainTypes.filter((chainType) => chainType !== value)
        : selectedChainTypes.concat(value)
    );

  return (
    <WatermarkedModal
      open={open}
      onClose={onClose}
      container={
        document.getElementById(WIDGET_UI_ID.SWAP_BOX_ID) || document.body
      }>
      <MessageBox
        type="info"
        title={i18n.t('Select chain types')}
        description={i18n.t(
          `This wallet supports multiple chains. Select which chain you'd like to connect to.`
        )}
        icon={
          <LogoContainer>
            <WalletImageContainer>
              <Image src={selectedWalletImage} size={45} />
            </WalletImageContainer>
            <Spinner />
          </LogoContainer>
        }
      />
      <ChainTypesList>
        {selectedWalletChainTypeItems.map((chainTypeItem) => (
          <ListItemButton
            key={chainTypeItem.value}
            id={chainTypeItem.value}
            title={chainTypeItem.title}
            hasDivider
            style={{ height: 60 }}
            onClick={() => handleChainTypeClick(chainTypeItem.value)}
            end={
              <Checkbox
                checked={selectedChainTypes.includes(chainTypeItem.value)}
              />
            }
          />
        ))}
      </ChainTypesList>
      <Button
        type="primary"
        disabled={!selectedChainTypes.length}
        onClick={() => onConfirm(selectedChainTypes)}>
        {i18n.t('Confirm')}
      </Button>
    </WatermarkedModal>
  );
};
