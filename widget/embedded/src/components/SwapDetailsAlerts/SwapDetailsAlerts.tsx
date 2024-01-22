import type { SwapAlertsProps } from './SwapDetailsAlerts.types';

import { i18n } from '@lingui/core';
import { Alert, IconButton, LinkIcon } from '@rango-dev/ui';
import React, { Fragment } from 'react';

import { isNetworkStatusInWarningState } from '../../utils/swap';

import { FailedAlert } from './SwapDetailsAlerts.Failed';
import { Alerts } from './SwapDetailsAlerts.styles';
import { WarningAlert } from './SwapDetailsAlerts.Warning';

export function SwapDetailsAlerts(props: SwapAlertsProps) {
  const {
    switchNetwork,
    showNetworkModal,
    setNetworkModal,
    message,
    step,
    hasAlreadyProceededToSign,
  } = props;

  const hasWarning = isNetworkStatusInWarningState(step);
  const waitingForApproval =
    step.status === 'waitingForApproval' && !hasWarning;
  const inProgress = step.status === 'running' && !hasWarning;
  const waitingProgress =
    (inProgress && !hasAlreadyProceededToSign) ||
    (waitingForApproval && !step.explorerUrl?.length);

  return (
    <Alerts>
      {step.explorerUrl?.map((explorerUrl, index, urls) => {
        const key = index + explorerUrl.url;
        const lastUrl = index === urls.length - 1;
        const loading =
          ((lastUrl && inProgress) || waitingForApproval) && !waitingProgress;
        const error = lastUrl && step.status === 'failed';

        return (
          <Fragment key={key}>
            <Alert
              type={
                lastUrl
                  ? (loading && 'loading') || (error && 'error') || 'success'
                  : 'success'
              }
              title={
                !explorerUrl.description
                  ? i18n.t('View transaction')
                  : `${explorerUrl.description} Tx`
              }
              action={
                explorerUrl.url && (
                  <IconButton
                    variant="ghost"
                    size="xsmall"
                    onClick={() => window.open(explorerUrl.url, '_blank')}>
                    <LinkIcon size={12} />
                  </IconButton>
                )
              }
            />
          </Fragment>
        );
      })}
      {waitingProgress && <Alert type="loading" title={message.shortMessage} />}
      {step.status !== 'failed' && hasWarning && (
        <WarningAlert
          switchNetwork={switchNetwork}
          showNetworkModal={showNetworkModal}
          setNetworkModal={setNetworkModal}
          message={message}
        />
      )}

      {step.status === 'failed' && <FailedAlert message={message} />}
    </Alerts>
  );
}
