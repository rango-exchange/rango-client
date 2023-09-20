import type { RouteWarning } from '../types';

import { i18n } from '@lingui/core';

import { RouteWarningType } from '../types';

export function getRouteWarningMessage(warning: RouteWarning) {
  switch (warning.type) {
    case RouteWarningType.ROUTE_UPDATED:
      return i18n.t('Route has been updated.');
    case RouteWarningType.ROUTE_AND_OUTPUT_AMOUNT_UPDATED:
      return i18n.t(
        'Output amount changed to {newOutputAmount} ({percentageChange}% change).',
        {
          newOutputAmount: warning.newOutputAmount,
          percentageChange: warning.percentageChange,
        }
      );
    case RouteWarningType.ROUTE_SWAPPERS_UPDATED:
      return i18n.t('Route swappers has been updated.');
    case RouteWarningType.ROUTE_COINS_UPDATED:
      return i18n.t('Route internal coins has been updated.');
    default:
      return '';
  }
}
