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
  if (warning) {
    if (warning.type === QuoteWarningType.HIGH_VALUE_LOSS) {
      const warningLevel = getPriceImpactLevel(warning.priceImpact);
      if (warningLevel === 'high') {
        alertInfo.alertType = 'error';
      }
      alertInfo.title = errorMessages().highValueLossError.title;
    }
    if (warning.type === QuoteWarningType.UNKNOWN_PRICE) {
      alertInfo.title = errorMessages().unknownPriceError.title;
    }
    if (warning.type === QuoteWarningType.INSUFFICIENT_SLIPPAGE) {
      alertInfo.title = i18n.t({
        id: 'minimum required slippage for this route: {minRequiredSlippage}',
        values: {
          minRequiredSlippage: warning.minRequiredSlippage,
        },
      });
    }
    if (warning.type === QuoteWarningType.HIGH_SLIPPAGE) {
      alertInfo.title = i18n.t('Caution, your slippage is high');
    }
    return alertInfo;
  }
  if (error) {
    alertInfo.alertType = 'error';
    if (error.type === QuoteErrorType.BRIDGE_LIMIT) {
      alertInfo.title = error.recommendation;
      alertInfo.action = null;
    }

    if (error.type === QuoteErrorType.INSUFFICIENT_SLIPPAGE) {
      alertInfo.title = '';
      alertInfo.action = 'change-settings';
    }

    return alertInfo;
  }
  return null;
}
