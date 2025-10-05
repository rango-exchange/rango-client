import type { PropTypes } from './InsufficientBalanceModal.types';

import { i18n } from '@lingui/core';
import { Button, Divider, MessageBox } from '@rango-dev/ui';
import React from 'react';

import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';

import { Description } from './InsufficientBalanceModal.styles';

export function InsufficientBalanceModal(props: PropTypes) {
  const { open, tokenSymbol, onClose, onConfirm, onChangeWallet } = props;

  return (
    <WatermarkedModal
      id="widget-confirm-wallets-insufficient-account-balance-modal"
      open={open}
      onClose={onClose}
      container={getContainer()}
      footer={
        <>
          {onChangeWallet && (
            <>
              <Divider size={20} />
              <Button
                id="widget-confirm-wallet-modal-proceed-anyway-btn"
                variant="contained"
                size="large"
                type="primary"
                fullWidth
                onClick={onChangeWallet}>
                {i18n.t('Change Wallet')}
              </Button>
              <Divider size={10} />
            </>
          )}
          <Button
            id="widget-confirm-wallet-modal-proceed-anyway-btn"
            variant="outlined"
            size="large"
            type="primary"
            fullWidth
            onClick={onConfirm}>
            {i18n.t('Proceed Anyway')}
          </Button>
        </>
      }>
      <MessageBox
        title={i18n.t('Insufficient {tokenSymbol} balance', { tokenSymbol })}
        type="error">
        <Description variant="body" size="medium" color="neutral700">
          {i18n.t(
            "You don't have enough {tokenSymbol} in your source wallet to complete the transaction.",
            { tokenSymbol }
          )}
        </Description>
      </MessageBox>
    </WatermarkedModal>
  );
}
