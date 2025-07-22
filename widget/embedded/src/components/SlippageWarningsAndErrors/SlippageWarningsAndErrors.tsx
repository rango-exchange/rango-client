import type { ActionType } from './SlippageWarningsAndErrors.helpers';
import type { PropTypes } from './SlippageWarningsAndErrors.types';

import { Alert, Button } from '@arlert-dev/ui';
import React from 'react';

import { DEFAULT_SLIPPAGE } from '../../constants/swapSettings';
import { useAppStore } from '../../store/AppStore';

import { makeAlerts } from './SlippageWarningsAndErrors.helpers';

export function SlippageWarningsAndErrors(props: PropTypes) {
  const { slippage, customSlippage, setSlippage, setCustomSlippage } =
    useAppStore();
  const { onChangeSettings } = props;
  const currentSlippage = customSlippage !== null ? customSlippage : slippage;

  const alertInfo = makeAlerts(currentSlippage);

  const onClickActionButton = (action: ActionType) => {
    if (action === 'reset-slippage') {
      setSlippage(DEFAULT_SLIPPAGE);
      setCustomSlippage(null);
    } else if (action === 'change-settings') {
      onChangeSettings();
    }
  };

  if (!alertInfo) {
    return null;
  }
  return (
    <Alert
      title={alertInfo.title}
      type={alertInfo.alertType}
      variant="alarm"
      action={
        <Button
          id="widget-slippage-warning-error-change-settings-or-reset-slippage-btn"
          size="xxsmall"
          type={alertInfo.alertType}
          onClick={() => onClickActionButton(alertInfo.action)}>
          {alertInfo.actionButtonTitle}
        </Button>
      }
    />
  );
}
