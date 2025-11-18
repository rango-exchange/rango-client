import type { PropTypes } from './InsufficientFeeModal.types';

import { i18n } from '@lingui/core';
import { Button, MessageBox } from '@rango-dev/ui';
import React from 'react';

import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';

import { InsufficientFeeWarning } from './InsufficientFeeWarning';

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
        {warnings.map((warning) => {
          const key =
            warning.selectedWallet.address + warning.selectedWallet.blockchain;
          return <InsufficientFeeWarning key={key} warning={warning} />;
        })}
      </MessageBox>
    </WatermarkedModal>
  );
}
