import type { Info } from './NoRoutes.types';

import { i18n } from '@lingui/core';

import { errorMessages } from '../../constants/errors';

export function makeInfo(
  diagnosisMessage: string | null,
  disabledLiquiditySources: string[],
  hasError: boolean,
  toggleAllLiquiditySources: (shouldReset: boolean) => void,
  refetchBestRoute: () => void
): Info {
  if (hasError) {
    return {
      alert: {
        type: 'warning',
        text: errorMessages().genericServerError,
        action: {
          onClick: refetchBestRoute,
          title: i18n.t('Retry'),
        },
      },
      description: '',
    };
  } else if (diagnosisMessage) {
    return {
      alert: {
        type: 'error',
        text: diagnosisMessage,
        action: null,
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
  }
  return {
    alert: null,
    description: errorMessages().noRoutesError.description,
  };
}
