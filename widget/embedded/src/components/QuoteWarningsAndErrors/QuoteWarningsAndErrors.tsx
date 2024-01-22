import type { PropTypes } from './QuoteWarningsAndErrors.types';

import { i18n } from '@lingui/core';
import { Alert, Button, InfoIcon } from '@rango-dev/ui';
import React from 'react';

import { QuoteErrorType, QuoteWarningType } from '../../types';
import { NoResult } from '../NoResult';

import { HighValueLossWarningModal } from './HighValueLossWarningModal';
import { makeAlerts } from './QuoteWarningsAndErrors.helpers';
import { Action, Alerts } from './QuoteWarningsAndErrors.styles';
import { SlippageWarningModal } from './SlippageWariningModal';
import { UnknownPriceWarningModal } from './UnknownPriceWarningModal';

export function QuoteWarningsAndErrors(props: PropTypes) {
  const {
    warning,
    error,
    showWarningModal,
    confirmationDisabled,
    refetchQuote,
    onOpenWarningModal,
    onCloseWarningModal,
    onConfirmWarningModal,
    onChangeSettings,
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

  const showAlerts = !!alertInfo;

  return (
    <>
      {showNoResultMessage && <NoResult error={error} fetch={refetchQuote} />}

      {showAlerts && (
        <Alerts>
          <Alert
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
            {...(alertInfo.action === 'change-settings' && {
              action: (
                <Button
                  size="xxsmall"
                  type={alertInfo.alertType}
                  onClick={onChangeSettings}>
                  {i18n.t('Change')}
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
