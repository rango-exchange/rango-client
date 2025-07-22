import type { PropTypes } from './DerivationPath.types';
import type { DerivationPath } from '@arlert-dev/wallets-shared';

import { i18n } from '@lingui/core';
import { Divider, Image, MessageBox, Select, TextField } from '@arlert-dev/ui';
import React, { useEffect, useState } from 'react';

import {
  CUSTOM_DERIVATION_PATH,
  getDerivationPaths,
} from './DerivationPath.helpers';
import {
  derivationPathInputStyles,
  InputLabel,
  InputsContainer,
} from './DerivationPath.styles';
import { StyledButton } from './Namespaces.styles';

const DEFAULT_DERIVATION_PATH_INDEX = '0';

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
  const [derivationPathIndex, setDerivationPathIndex] = useState(
    DEFAULT_DERIVATION_PATH_INDEX
  );

  const isCustomOptionSelected =
    selectedDerivationPathId === CUSTOM_DERIVATION_PATH.id;

  const derivationPaths = getDerivationPaths(selectedNamespace);

  const handleDerivationPathItemClick = ({ value }: { value: string }) => {
    const selectedDerivationPath = derivationPaths?.find(
      (derivationPath) => derivationPath.id === value
    );

    if (selectedDerivationPath) {
      /*
       * Custom mode accepts string, but other modes only accepts number,
       * Here we are checking if user is on custom mode and trying to switch to another mode
       * if it's an string we will keep it, if not we will reset the value to default
       */
      if (
        selectedDerivationPathId === CUSTOM_DERIVATION_PATH.id &&
        Number.isNaN(Number(derivationPathIndex))
      ) {
        setDerivationPathIndex(DEFAULT_DERIVATION_PATH_INDEX);
      }

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
        description={i18n.t({
          id: 'In order to connect to {type}, you must first select a Derivation Path',
          values: {
            type,
          },
        })}
        icon={<Image src={image} size={45} />}
      />

      <InputsContainer>
        <InputLabel variant="body" size="xsmall" color="$neutral600">
          {i18n.t('Choose Derivation Path Template')}
        </InputLabel>
        <Select
          id="widget-derivation-path-template-select"
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
          id="widget-derivation-path-template-input"
          type={isCustomOptionSelected ? 'text' : 'number'}
          variant="contained"
          value={derivationPathIndex}
          onChange={(event) => setDerivationPathIndex(event.target.value)}
          style={derivationPathInputStyles}
        />
      </InputsContainer>

      <StyledButton
        id="widget-derivation-path-confirm-btn"
        type="primary"
        onClick={handleConfirm}
        disabled={
          !derivationPaths || !selectedDerivationPathId || !derivationPathIndex
        }>
        {i18n.t('Confirm')}
      </StyledButton>
    </>
  );
}
