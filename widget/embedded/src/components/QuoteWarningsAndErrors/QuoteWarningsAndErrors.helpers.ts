import type {
  BridgeLimitError,
  InsufficientSlippageError,
  QuoteWarning,
} from '../../types';

import { i18n } from '@lingui/core';

import { errorMessages } from '../../constants/errors';
import { QuoteErrorType, QuoteWarningType } from '../../types';
import { getPriceImpactLevel } from '../../utils/quote';

type AlertInfo = {
  alertType: 'error' | 'warning';
  title: string;
  action: 'show-info' | 'change-settings' | null;
};

export function makeAlerts(
  warning: QuoteWarning | null,
  error: BridgeLimitError | InsufficientSlippageError | null
): AlertInfo | null {
  const alertInfo: AlertInfo = {
    alertType: 'warning',
    title: '',
    action: 'show-info',
  };
  if (error) {
    alertInfo.alertType = 'error';
    if (error.type === QuoteErrorType.BRIDGE_LIMIT) {
      alertInfo.title = error.recommendation;
      alertInfo.action = 'show-info';
    }

    if (error.type === QuoteErrorType.INSUFFICIENT_SLIPPAGE) {
      alertInfo.title = i18n.t({
        id: 'You need to increase slippage to at least {minRequiredSlippage} for this route.',
        values: {
          minRequiredSlippage: error.minRequiredSlippage,
        },
      });
      alertInfo.action = 'change-settings';
    }

    return alertInfo;
  }
  if (warning) {
    if (warning.type === QuoteWarningType.HIGH_VALUE_LOSS) {
      const warningLevel = getPriceImpactLevel(warning.priceImpact);
      if (warningLevel === 'high') {
        alertInfo.alertType = 'error';
      }
      alertInfo.action = null;
      alertInfo.title = errorMessages().highValueLossError.title;
    }
    if (warning.type === QuoteWarningType.UNKNOWN_PRICE) {
      alertInfo.title = errorMessages().unknownPriceError.title;
    }
    if (warning.type === QuoteWarningType.INSUFFICIENT_SLIPPAGE) {
      alertInfo.title = i18n.t({
        id: 'We recommend you to increase slippage to at least {minRequiredSlippage} for this route.',
        values: {
          minRequiredSlippage: warning.minRequiredSlippage,
        },
      });
      alertInfo.action = 'change-settings';
    }
    if (warning.type === QuoteWarningType.HIGH_SLIPPAGE) {
      alertInfo.title = i18n.t('Caution, your slippage is high.');
    }
    return alertInfo;
  }
  return null;
}
