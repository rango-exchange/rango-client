import type { PropTypes } from './WalletDerivationPathModal.types';
import type { DerivationPath, Namespace } from '@rango-dev/wallets-shared';

import { i18n } from '@lingui/core';
import {
  Button,
  Divider,
  Image,
  MessageBox,
  Select,
  TextField,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { WIDGET_UI_ID } from '../../constants';
import { namespaces } from '../../constants/namespaces';
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

const customDerivationPath: DerivationPath = {
  id: 'custom',
  label: 'Custom',
  generateDerivationPath: (index: string) => index,
};

function getDerivationPaths(selectedNamespace?: Namespace) {
  const selectedNamespaceDerivationPaths = selectedNamespace
    ? namespaces[selectedNamespace].derivationPaths
    : null;

  const derivationPaths: DerivationPath[] = !!selectedNamespaceDerivationPaths
    ? [...selectedNamespaceDerivationPaths, customDerivationPath]
    : [];

  return derivationPaths;
}

export function WalletDerivationPathModal(props: PropTypes) {
  const { onClose, onConfirm, selectedNamespace, image, type, open } = props;

  const [selectedDerivationPathId, setSelectedDerivationPathId] = useState<
    string | null
  >(null);
  const [derivationPathIndex, setDerivationPathIndex] = useState('0');

  const isCustomOptionSelected =
    selectedDerivationPathId === customDerivationPath.id;

  const derivationPaths = getDerivationPaths(selectedNamespace);

  const handleDerivationPathItemClick = ({ value }: { value: string }) => {
    const selectedDerivationPath = derivationPaths?.find(
      (derivationPath) => derivationPath.id === value
    );

    if (selectedDerivationPath) {
      setSelectedDerivationPathId(selectedDerivationPath.id);
    }
  };

  const handleConfirm = () => {
    const selectedDerivationPath = derivationPaths.find(
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
    setSelectedDerivationPathId(
      getDerivationPaths(selectedNamespace)[0]?.id || null
    );
  }, [selectedNamespace]);

  return (
    <WatermarkedModal
      open={open}
      onClose={onClose}
      container={
        document.getElementById(WIDGET_UI_ID.SWAP_BOX_ID) || document.body
      }>
      <Divider size={20} />
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
          value={selectedDerivationPathId || ''}
          options={derivationPaths.map((derivationPath) => ({
            value: derivationPath.id,
            label: derivationPath.label,
          }))}
          variant="filled"
          handleItemClick={handleDerivationPathItemClick}
          styles={{ trigger: derivationPathInputStyles }}
        />
        <Divider size={20} />
        <InputLabel variant="body" size="xsmall" color="$neutral600">
          {isCustomOptionSelected
            ? i18n.t('Enter Path')
            : i18n.t('Enter Index')}
        </InputLabel>
        <TextField
          type={isCustomOptionSelected ? 'text' : 'number'}
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
