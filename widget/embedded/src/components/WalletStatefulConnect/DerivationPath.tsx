import type { PropTypes } from './DerivationPath.types';
import type { DerivationPath } from '@rango-dev/wallets-shared';

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

import {
  LogoContainer,
  Spinner,
  WalletImageContainer,
} from './ConnectStatus.styles';
import {
  CUSTOM_DERIVATION_PATH,
  getDerivationPaths,
} from './DerivationPath.helpers';
import {
  derivationPathInputStyles,
  InputLabel,
  InputsContainer,
} from './DerivationPath.styles';

export function DerivationPath(props: PropTypes) {
  const { onConfirm } = props;
  const {
    namespace: selectedNamespace,
    providerImage: image,
    providerType: type,
  } = props.value;

  const [selectedDerivationPathId, setSelectedDerivationPathId] = useState<
    string | null
  >(null);
  const [derivationPathIndex, setDerivationPathIndex] = useState('0');

  const isCustomOptionSelected =
    selectedDerivationPathId === CUSTOM_DERIVATION_PATH.id;

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
    <>
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
    </>
  );
}
