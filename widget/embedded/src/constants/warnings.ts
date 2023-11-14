import type { QuoteUpdateWarning } from '../types';

import { i18n } from '@lingui/core';

import { QuoteUpdateType } from '../types';

export function getQuoteUpdateWarningMessage(warning: QuoteUpdateWarning) {
  switch (warning.type) {
    case QuoteUpdateType.QUOTE_UPDATED:
      return i18n.t('Route has been updated.');
    case QuoteUpdateType.QUOTE_AND_OUTPUT_AMOUNT_UPDATED:
      return i18n.t(
        'Output amount changed to {newOutputAmount} ({percentageChange}% change).',
        {
          newOutputAmount: warning.newOutputAmount,
          percentageChange: warning.percentageChange,
        }
      );
    case QuoteUpdateType.QUOTE_SWAPPERS_UPDATED:
      return i18n.t('Route swappers has been updated.');
    case QuoteUpdateType.QUOTE_COINS_UPDATED:
      return i18n.t('Route internal coins has been updated.');
    default:
      return '';
  }
}
