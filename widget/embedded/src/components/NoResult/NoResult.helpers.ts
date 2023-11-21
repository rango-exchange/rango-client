import type { Info } from './NoResult.types';

import { i18n } from '@lingui/core';

import { errorMessages } from '../../constants/errors';
import {
  type NoResultError,
  QuoteErrorType,
  type QuoteRequestFailed,
} from '../../types';

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
