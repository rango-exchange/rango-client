import type { ConfirmSwapError } from '../types';

import { i18n } from '@lingui/core';

import { ConfirmSwapErrorTypes } from '../types';

export const errorMessages = {
  genericServerError: i18n.t('Failed Network, Please retry your swap.'),
  liquiditySourcesError: {
    title: i18n.t('Please reset your liquidity sources.'),
    description: i18n.t(
      'You have limited the liquidity sources and this might result in Rango finding no routes. Please consider resetting your liquidity sources'
    ),
  },
  noRoutesError: {
    title: i18n.t('No Routes Found'),
    description:
      "Reasons why Rango couldn't find a route: low liquidity on token, very low input amount or no routes available for the selected input/output token combination.",
  },
  bridgeLimitErrors: {
    increaseAmount: i18n.t('Bridge Limit Error: Please increase your amount'),
    decreaseAmount: i18n.t('Bridge Limit Error: Please decrease your amount'),
  },
  highValueLossError: {
    impactTitle: i18n.t('High Price Impact'),
    title: i18n.t('Price impact is too high!'),
    description: i18n.t(
      'The price impact is significantly higher than the allowed amount. If you are sure, continue, otherwise, change the swap.'
    ),
    confirmMessage: i18n.t('Confirm High price impact'),
  },
  routeUpdatedWithHighValueLoss: {
    title: i18n.t(
      'Route updated and price impact is too high, try again later!'
    ),
  },
  unknownPriceError: {
    impactTitle: i18n.t('USD Price Unknown'),
    title: i18n.t('USD Price Unknown, Cannot calculate Price Impact.'),
    description: i18n.t(
      'USD Price Unknown, Cannot calculate Price Impact. The price impact may be higher than usual. Are you sure to continue the Swap?'
    ),
    confirmMessage: i18n.t('Confirm USD Price Unknown'),
  },
};

export function getConfirmSwapErrorMessage(error: ConfirmSwapError) {
  switch (error.type) {
    case ConfirmSwapErrorTypes.NO_ROUTE:
      return error.diagnosisMessage ?? errorMessages.noRoutesError.title;
    case ConfirmSwapErrorTypes.REQUEST_FAILED:
      return errorMessages.genericServerError;
    case ConfirmSwapErrorTypes.ROUTE_UPDATED_WITH_HIGH_VALUE_LOSS:
      return errorMessages.routeUpdatedWithHighValueLoss.title;
    default:
      return '';
  }
}
