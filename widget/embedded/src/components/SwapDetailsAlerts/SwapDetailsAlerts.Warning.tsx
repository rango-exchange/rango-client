import type { WaningAlertsProps } from './SwapDetailsAlerts.types';

import { i18n } from '@lingui/core';
import { Alert, Button } from '@rango-dev/ui';
import { PendingSwapNetworkStatus } from 'rango-types';
import React from 'react';

export function WarningAlert(props: WaningAlertsProps) {
  const { switchNetwork, setNetworkModal, message, showNetworkModal } = props;
  if (!!switchNetwork) {
    return (
      <Alert
        type="warning"
        title={message.shortMessage}
        action={
          <Button
            size="xxsmall"
            type="warning"
            onClick={() => {
              setNetworkModal(PendingSwapNetworkStatus.WaitingForNetworkChange);
              switchNetwork().catch((e) => {
                console.log(e);
              });
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
        action={
          <Button
            size="xxsmall"
            type="warning"
            onClick={() => {
              setNetworkModal(
                PendingSwapNetworkStatus.WaitingForConnectingWallet
              );
            }}>
            {i18n.t('Connect')}
          </Button>
        }
      />
    );
  }

  return <Alert type="warning" title={message.shortMessage} />;
}
