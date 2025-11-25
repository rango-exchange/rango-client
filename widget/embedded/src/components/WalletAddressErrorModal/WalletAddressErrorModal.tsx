import type { PropTypes } from './WalletAddressErrorModal.types';

import { i18n } from '@lingui/core';
import { Button, MessageBox } from '@rango-dev/ui';
import React from 'react';

import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';

import { Description } from './WalletAddressErrorModal.styles';

export function WalletAddressErrorModal(props: PropTypes) {
  const { open, onClose, onConfirm } = props;

  return (
    <WatermarkedModal
      id="widget-confirm-wallets-insufficient-account-balance-modal"
      open={open}
      onClose={onClose}
      container={getContainer()}
      footer={
        <Button
          id="widget-confirm-wallet-modal-proceed-anyway-btn"
          variant="contained"
          size="large"
          type="primary"
          fullWidth
          onClick={onConfirm}>
          {i18n.t('Ok')}
        </Button>
      }>
      <MessageBox title={i18n.t('Wallet address Error')} type="error">
        <Description variant="body" size="medium" color="neutral700">
          {i18n.t(
            'The selected route requires the same source and recipient address. Please choose a different route or make sure the recipient wallet matches the source.'
          )}
        </Description>
      </MessageBox>
    </WatermarkedModal>
  );
}
