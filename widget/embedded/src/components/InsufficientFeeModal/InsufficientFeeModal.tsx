import type { PropTypes } from './InsufficientFeeModal.types';

import { i18n } from '@lingui/core';
import { Alert, Button, Image, MessageBox, Typography } from '@rango-dev/ui';
import React from 'react';

import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';

import { WarningItem } from './InsufficientFeeModal.styles';

export function InsufficientFeeModal(props: PropTypes) {
  const { open, onClose, onConfirm, warnings } = props;

  return (
    <WatermarkedModal
      id="widget-confirm-wallets-insufficient-account-balance-modal"
      open={open}
      onClose={onClose}
      container={getContainer()}
      footer={
        <Button
          id="widget-confirm-wallet-modal-proceed-anyway-btn"
          variant="outlined"
          size="large"
          type="primary"
          fullWidth
          onClick={onConfirm}>
          {i18n.t('Proceed Anyway')}
        </Button>
      }>
      <MessageBox title={i18n.t('Insufficient account balance')} type="warning">
        {warnings.map((warning) => (
          <WarningItem key={warning.selectedWallet.blockchain}>
            <div>
              <Image src={warning.selectedWallet.image} size={20} />
              <Alert
                type="warning"
                variant="alarm"
                title={i18n.t('Network fee')}
              />
            </div>
            <div>
              <Typography variant="body" size="medium">
                {i18n.t('Required Balance:')}
              </Typography>
              <Typography variant="title" size="small">
                {warning.requiredBalance}
              </Typography>
            </div>
            <div>
              <Typography variant="body" size="medium">
                {i18n.t('Your Balance:')}
              </Typography>
              <Typography variant="title" size="small">
                {warning.userBalance}
              </Typography>
            </div>
          </WarningItem>
        ))}
      </MessageBox>
    </WatermarkedModal>
  );
}
