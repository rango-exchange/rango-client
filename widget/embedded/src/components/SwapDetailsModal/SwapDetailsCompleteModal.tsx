import type { CompleteModalPropTypes } from './SwapDetailsModal.types';

import { i18n } from '@lingui/core';
import {
  Button,
  Divider,
  MessageBox,
  Modal,
  TokenAmount,
  Typography,
} from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../../constants/navigationRoutes';

export function SwapDetailsCompleteModal(props: CompleteModalPropTypes) {
  const {
    open,
    onClose,
    status,
    priceValue,
    usdValue,
    token,
    chain,
    percentageChange,
    description,
    diagnosisUrl,
  } = props;
  const navigate = useNavigate();

  return (
    <Modal
      open={open}
      onClose={onClose}
      container={document.getElementById('swap-box') || document.body}>
      {status === 'success' ? (
        <MessageBox type="success" title={i18n.t('Swap Successful')}>
          <TokenAmount
            direction="vertical"
            type="output"
            centerAlign={true}
            price={{
              value: priceValue,
              usdValue,
            }}
            token={token}
            chain={chain}
            percentageChange={percentageChange}
          />
          <Divider size={12} />
          <Typography
            variant="body"
            size="medium"
            color="neutral900"
            align="center">
            {description}
          </Typography>
        </MessageBox>
      ) : (
        <MessageBox
          type="error"
          title={i18n.t('Transaction Failed')}
          description={description}
        />
      )}
      <Divider size={32} />
      {status === 'success' && (
        <Button
          variant="contained"
          type="primary"
          size="large"
          onClick={() => navigate(navigationRoutes.home)}>
          <Typography variant="title" size="medium" color="neutral100">
            {i18n.t('Done')}
          </Typography>
        </Button>
      )}
      <Divider size={12} />
      {diagnosisUrl && (
        <>
          <Button
            variant="contained"
            type="primary"
            size="large"
            onClick={() => window.open(diagnosisUrl, '_blank')}>
            <Typography variant="title" size="medium" color="primary">
              {i18n.t('Diagnosis')}
            </Typography>
          </Button>
          <Divider size={12} />
        </>
      )}
      <Button variant="outlined" type="primary" size="large" onClick={onClose}>
        <Typography variant="title" size="medium" color="primary">
          {i18n.t('See Details')}
        </Typography>
      </Button>
    </Modal>
  );
}
