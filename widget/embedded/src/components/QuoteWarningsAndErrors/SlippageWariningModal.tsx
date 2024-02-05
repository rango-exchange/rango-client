import type {
  HighSlippageWarning,
  InsufficientSlippageWarning,
} from '../../types';

import { i18n } from '@lingui/core';
import { Button, Divider, MessageBox, Typography } from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../../constants/navigationRoutes';
import { useAppStore } from '../../store/AppStore';
import { QuoteWarningType } from '../../types';
import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';

type PropsTypes = {
  open: boolean;
  confirmationDisabled: boolean;
  onClose: () => void;
  onConfirm: () => void;
  warning: InsufficientSlippageWarning | HighSlippageWarning;
};

export function SlippageWarningModal(props: PropsTypes) {
  const { customSlippage, slippage } = useAppStore();
  const { open, onClose, onConfirm, warning, confirmationDisabled } = props;
  const navigate = useNavigate();
  const userSlippage = customSlippage ?? slippage;

  return (
    <WatermarkedModal
      anchor="bottom"
      open={open}
      prefix={
        <Button
          size="small"
          variant="ghost"
          onClick={() => navigate('../' + navigationRoutes.settings)}>
          <Typography variant="label" size="medium" color="$neutral900">
            {i18n.t('Change settings')}
          </Typography>
        </Button>
      }
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
            ? i18n.t({
                id: ' Caution, your slippage is high (={userSlippage}). Your trade may be front run.',
                values: { userSlippage },
              })
            : i18n.t({
                id: 'We recommend you to increase slippage to at least {minRequiredSlippage} for this route.',
                values: {
                  minRequiredSlippage: warning.minRequiredSlippage,
                },
              })
        }>
        <Divider size={18} />
        <Divider size={32} />
        <Button
          size="large"
          type="primary"
          variant="contained"
          fullWidth
          disabled={confirmationDisabled}
          onClick={onConfirm}>
          {i18n.t('Confirm anyway')}
        </Button>
      </MessageBox>
    </WatermarkedModal>
  );
}
