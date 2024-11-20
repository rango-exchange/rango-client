import type { Info } from './NoResult.types';
import type { NoResultError, QuoteRequestFailed } from '../../types';

import { i18n } from '@lingui/core';

import { errorMessages } from '../../constants/errors';
import { QuoteErrorType } from '../../types';

const SMALL_NO_ROUTE__ICON_SIZE = 24;
const LARGE_NO_ROUTE_ICON_SIZE = 60;

export function makeInfo(
  error: NoResultError | QuoteRequestFailed | null,
  disabledLiquiditySources: string[],
  toggleAllLiquiditySources: (shouldReset: boolean) => void,
  refetchQuote: () => void
): Info {
  if (error?.type === QuoteErrorType.REQUEST_FAILED) {
    return {
      alert: {
        type: 'warning',
        text: errorMessages().genericServerError,
        action: {
          onClick: refetchQuote,
          title: i18n.t('Retry'),
        },
      },
      description: '',
    };
  } else if (disabledLiquiditySources.length) {
    return {
      alert: {
        type: 'warning',
        text: errorMessages().liquiditySourcesError.title,
        action: {
          onClick: () => toggleAllLiquiditySources(true),
          title: i18n.t('Reset'),
        },
      },
      description: errorMessages().liquiditySourcesError.description,
    };
  } else if (
    error?.type === QuoteErrorType.NO_RESULT &&
    error.diagnosisMessage
  ) {
    return {
      alert: {
        type: 'error',
        text: error.diagnosisMessage,
        action: null,
      },
      description: '',
    };
  }
  return {
    alert: null,
    description: errorMessages().noResultError.description,
  };
}

export enum NoRouteIconSize {
  small = SMALL_NO_ROUTE__ICON_SIZE,
  large = LARGE_NO_ROUTE_ICON_SIZE,
}

export enum NoRouteTitleSize {
  small = 'small',
  large = 'medium',
}
