import type { ActionType } from './QuoteWarningsAndErrors.helpers';
import type { PropTypes } from './QuoteWarningsAndErrors.types';

import { i18n } from '@lingui/core';
import { Alert, Button, Divider, InfoIcon } from '@arlert-dev/ui';
import React from 'react';

import { QuoteErrorType, QuoteWarningType } from '../../types';
import { NoResult } from '../NoResult';

import { HighValueLossWarningModal } from './HighValueLossWarningModal';
import {
  getRequiredSlippage,
  makeAlerts,
} from './QuoteWarningsAndErrors.helpers';
import { Action, Alerts } from './QuoteWarningsAndErrors.styles';
import { SlippageWarningModal } from './SlippageWariningModal';
import { UnknownPriceWarningModal } from './UnknownPriceWarningModal';

export function QuoteWarningsAndErrors(props: PropTypes) {
  const {
    warning,
    error,
    couldChangeSettings,
    showWarningModal,
    confirmationDisabled,
    skipAlerts,
    refetchQuote,
    onOpenWarningModal,
    onCloseWarningModal,
    onConfirmWarningModal,
    onChangeSettings,
    onChangeSlippage,
  } = props;

  const warningModalHandlers = {
    confirmationDisabled,
    open: showWarningModal,
    onClose: onCloseWarningModal,
    onConfirm: onConfirmWarningModal,
  };

  const showNoResultMessage =
    error?.type === QuoteErrorType.NO_RESULT ||
    error?.type === QuoteErrorType.REQUEST_FAILED;

  const alertInfo = makeAlerts(
    warning,
    error?.type === QuoteErrorType.BRIDGE_LIMIT ||
      error?.type === QuoteErrorType.INSUFFICIENT_SLIPPAGE
      ? error
      : null
  );
  if (alertInfo && !couldChangeSettings) {
    alertInfo.action = null;
  }

  const showAlerts = !!alertInfo && !skipAlerts;

  const onclickActionButton = (action: ActionType) => {
    if (action === 'change-slippage') {
      const quoteError =
        error?.type === QuoteErrorType.BRIDGE_LIMIT ||
        error?.type === QuoteErrorType.INSUFFICIENT_SLIPPAGE
          ? error
          : null;
      const requestedSlippage = getRequiredSlippage(warning, quoteError);
      onChangeSlippage?.(requestedSlippage);
    } else if (action === 'change-settings') {
      onChangeSettings();
    }
  };

  return (
    <>
      {showNoResultMessage && (
        <>
          <Divider size={10} />
          <NoResult
            skipAlerts={skipAlerts}
            error={error}
            fetch={refetchQuote}
          />
        </>
      )}

      {showAlerts && (
        <Alerts>
          <Divider size={10} />
          <Alert
            id="widget-quote-warning-and-errors-alert"
            title={alertInfo.title}
            type={alertInfo.alertType}
            variant="alarm"
            {...(alertInfo.action === 'show-info' && {
              action: (
                <Action onClick={onOpenWarningModal}>
                  <InfoIcon size={12} color="gray" />
                </Action>
              ),
            })}
            {...((alertInfo.action === 'change-settings' ||
              alertInfo.action === 'change-slippage') && {
              action: (
                <Button
                  id="widget-quote-warning-error-change-settings-btn"
                  size="xxsmall"
                  type={alertInfo.alertType}
                  onClick={() => onclickActionButton(alertInfo.action)}>
                  {alertInfo.actionButtonTitle || i18n.t('Change')}
                </Button>
              ),
            })}
          />
        </Alerts>
      )}

      {warning && (
        <>
          {warning.type === QuoteWarningType.HIGH_VALUE_LOSS && (
            <HighValueLossWarningModal
              {...warningModalHandlers}
              warning={warning}
            />
          )}

          {(warning.type === QuoteWarningType.HIGH_SLIPPAGE ||
            warning.type === QuoteWarningType.INSUFFICIENT_SLIPPAGE) && (
            <SlippageWarningModal {...warningModalHandlers} warning={warning} />
          )}

          {warning.type === QuoteWarningType.UNKNOWN_PRICE && (
            <UnknownPriceWarningModal
              {...warningModalHandlers}
              warning={warning}
            />
          )}
        </>
      )}
    </>
  );
}
