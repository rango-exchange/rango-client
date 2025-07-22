import type {
  HighSlippageWarning,
  InsufficientSlippageWarning,
} from '../../types';

import { i18n } from '@lingui/core';
import { Button, Divider, MessageBox, WarningIcon } from '@arlert-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../../constants/navigationRoutes';
import { QuoteWarningType } from '../../types';
import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';

import { SwapButton } from './QuoteWarningsAndErrors.styles';

type PropsTypes = {
  open: boolean;
  confirmationDisabled: boolean;
  onClose: () => void;
  onConfirm: () => void;
  warning: InsufficientSlippageWarning | HighSlippageWarning;
};

export function SlippageWarningModal(props: PropsTypes) {
  const { open, onClose, onConfirm, warning, confirmationDisabled } = props;
  const navigate = useNavigate();

  return (
    <WatermarkedModal
      id="widget-slippage-warning-modal"
      anchor="bottom"
      open={open}
      container={getContainer()}
      onClose={onClose}>
      <MessageBox
        type="warning"
        title={
          warning.type === QuoteWarningType.HIGH_SLIPPAGE
            ? i18n.t('High slippage')
            : i18n.t('Low slippage')
        }
        description={
          warning.type === QuoteWarningType.HIGH_SLIPPAGE
            ? i18n.t(
                'Caution, your slippage is high. Your trade may be front run.'
              )
            : i18n.t({
                id: 'We recommend you to increase slippage to at least {minRequiredSlippage} for this route.',
                values: {
                  minRequiredSlippage: warning.minRequiredSlippage,
                },
              })
        }>
        <Divider size={18} />
        <Divider size={32} />
        <SwapButton
          id="widget-slippage-warning-modal-confirm-anyway-btn"
          size="large"
          type="primary"
          variant="contained"
          fullWidth
          disabled={confirmationDisabled}
          onClick={onConfirm}>
          <WarningIcon color="white" size={16} />
          {i18n.t('Swap anyway')}
        </SwapButton>
        <Divider size={10} />
        <Button
          id="widget-slippage-warning-modal-change-slippage-btn"
          size="large"
          type="primary"
          variant="outlined"
          fullWidth
          disabled={confirmationDisabled}
          onClick={() => navigate('../' + navigationRoutes.settings)}>
          {i18n.t('Change Slippage')}
        </Button>
      </MessageBox>
    </WatermarkedModal>
  );
}
