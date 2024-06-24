import type { PropTypes } from './WalletDerivationPathModal.types';

import { i18n } from '@lingui/core';
import { Button, Image, MessageBox, Select, TextField } from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { WIDGET_UI_ID } from '../../constants';
import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';
import {
  LogoContainer,
  Spinner,
  WalletImageContainer,
} from '../WalletModal/WalletModalContent.styles';

import {
  derivationPathInputStyles,
  InputLabel,
  InputsContainer,
} from './WalletDerivationPathModal.styles';

export function WalletDerivationPathModal(props: PropTypes) {
  const { onClose, onConfirm, open, derivationPaths, image, type } = props;

  const [selectedDerivationPathId, setSelectedDerivationPathId] = useState(
    derivationPaths?.[0]?.id || ''
  );
  const [derivationPathIndex, setDerivationPathIndex] = useState('0');

  const handleConfirm = () => {
    const selectedDerivationPath = derivationPaths?.find(
      (derivationPath) => derivationPath.id === selectedDerivationPathId
    );

    if (selectedDerivationPath) {
      onConfirm(
        selectedDerivationPath.generateDerivationPath(derivationPathIndex)
      );
    } else {
      // Unreachable code
      throw new Error('selectedDerivationPath can not be undefined');
    }
  };

  useEffect(() => {
    setSelectedDerivationPathId(derivationPaths?.[0]?.id || '');
  }, [derivationPaths]);

  return (
    <WatermarkedModal
      open={open}
      onClose={onClose}
      container={
        document.getElementById(WIDGET_UI_ID.SWAP_BOX_ID) || document.body
      }
      styles={{ content: { marginTop: 20 } }}>
      <MessageBox
        type="info"
        title={i18n.t('Select Derivation Path')}
        description={i18n.t(
          `In order to connect to ${type}, you must first select a Derivation Path`
        )}
        icon={
          <LogoContainer>
            <WalletImageContainer>
              <Image src={image} size={45} />
            </WalletImageContainer>
            <Spinner />
          </LogoContainer>
        }
      />

      <InputsContainer>
        <InputLabel variant="body" size="xsmall" color="$neutral600">
          {i18n.t('Choose Derivation Path Template')}
        </InputLabel>
        <Select
          container={getContainer()}
          value={selectedDerivationPathId}
          options={
            derivationPaths?.map((derivationPath) => ({
              value: derivationPath.id,
              label: derivationPath.label,
            })) || []
          }
          variant="filled"
          handleItemClick={(item) => setSelectedDerivationPathId(item.value)}
          styles={{ trigger: derivationPathInputStyles }}
        />

        <InputLabel
          variant="body"
          size="xsmall"
          color="$neutral600"
          css={{ marginTop: 20 }}>
          {i18n.t('Enter Index')}
        </InputLabel>
        <TextField
          variant="contained"
          value={derivationPathIndex}
          onChange={(event) => setDerivationPathIndex(event.target.value)}
          style={derivationPathInputStyles}
        />
      </InputsContainer>

      <Button
        type="primary"
        onClick={handleConfirm}
        disabled={
          !derivationPaths || !selectedDerivationPathId || !derivationPathIndex
        }>
        {i18n.t('Confirm')}
      </Button>
    </WatermarkedModal>
  );
}
