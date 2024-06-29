import type { PropTypes } from './WalletDerivationPathModal.types';
import type { DerivationPath } from '@rango-dev/wallets-shared';

import { i18n } from '@lingui/core';
import { Button, Image, MessageBox, Select, TextField } from '@rango-dev/ui';
import { namespaces } from '@rango-dev/wallets-shared';
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
  const { onClose, onConfirm, selectedNamespace, image, type } = props;

  const derivationPaths: DerivationPath[] | undefined = !!selectedNamespace
    ? namespaces[selectedNamespace].derivationPaths
    : undefined;

  const [selectedDerivationPath, setSelectedDerivationPath] =
    useState<DerivationPath | null>(derivationPaths?.[0] || null);
  const [derivationPathIndex, setDerivationPathIndex] = useState('0');

  const handleConfirm = () => {
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
    setSelectedDerivationPath(derivationPaths?.[0] || null);
  }, [derivationPaths]);

  return (
    <WatermarkedModal
      open={!!derivationPaths}
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
          value={selectedDerivationPath?.id || ''}
          options={
            derivationPaths?.map((derivationPath) => ({
              value: derivationPath.id,
              label: derivationPath.label,
            })) || []
          }
          variant="filled"
          handleItemClick={(item) =>
            setSelectedDerivationPath(
              derivationPaths?.find(
                (derivationPath) => derivationPath.id === item.value
              ) ?? null
            )
          }
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
          !derivationPaths || !selectedDerivationPath || !derivationPathIndex
        }>
        {i18n.t('Confirm')}
      </Button>
    </WatermarkedModal>
  );
}
