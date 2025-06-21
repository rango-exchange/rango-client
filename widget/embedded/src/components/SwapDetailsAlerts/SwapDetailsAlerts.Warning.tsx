import type { WaningAlertsProps } from './SwapDetailsAlerts.types';

import { i18n } from '@lingui/core';
import { Alert, Button } from '@rango-dev/ui';
import { PendingSwapNetworkStatus } from 'rango-types';
import React from 'react';

export function WarningAlert(props: WaningAlertsProps) {
  const {
    switchNetworkIsAvailable,
    handleSwitchNetworkClick,
    setNetworkModal,
    message,
    showNetworkModal,
  } = props;
  if (!!switchNetworkIsAvailable) {
    return (
      <Alert
        type="warning"
        id="widget-swap-details-change-network-alert"
        title={message.shortMessage}
        action={
          <Button
            id="widget-swap-details-warning-alert-change-network-btn"
            size="xxsmall"
            type="warning"
            onClick={() => {
              setNetworkModal('switchNetwork');
              handleSwitchNetworkClick();
            }}>
            {i18n.t('Change')}
          </Button>
        }
      />
    );
  }
  if (
    showNetworkModal === PendingSwapNetworkStatus.WaitingForConnectingWallet
  ) {
    return (
      <Alert
        type="warning"
        title={message.shortMessage}
        id="widget-swap-details-warning-alert-connect-wallet-alert"
        action={
          <Button
            id="widget-swap-details-warning-alert-connect-wallet-btn"
            size="xxsmall"
            type="warning"
            onClick={() => {
              setNetworkModal('connectWallet');
            }}>
            {i18n.t('Connect')}
          </Button>
        }
      />
    );
  }

  return (
    <Alert
      id="widget-swap-details-short-alert"
      type="warning"
      title={message.shortMessage}
    />
  );
}
