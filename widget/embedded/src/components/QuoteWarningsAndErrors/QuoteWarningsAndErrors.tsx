import type { PropTypes } from './QuoteWarningsAndErrors.types';

import { i18n } from '@lingui/core';
import { Alert, Button, InfoIcon } from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../../constants/navigationRoutes';
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
    refetchQuote,
    showWarningModal,
    onOpenWarningModal,
    onCloseWarningModal,
    onConfirmWarningModal,
  } = props;

  const navigate = useNavigate();

  const warningModalHandlers = {
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
            action={
              alertInfo.action === 'show-info' ? (
                <Action onClick={onOpenWarningModal}>
                  <InfoIcon size={12} color="gray" />
                </Action>
              ) : (
                <Button
                  size="xsmall"
                  type={'error'}
                  onClick={() => navigate(navigationRoutes.settings)}>
                  {i18n.t('Change Settings')}
                </Button>
              )
            }
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
