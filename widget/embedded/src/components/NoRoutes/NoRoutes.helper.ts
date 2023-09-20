import type { Info } from './NoRoutes.types';

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
        text: errorMessages.genericServerError,
        action: {
          onClick: refetchBestRoute,
          title: 'Retry',
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
        text: errorMessages.liquiditySourcesError.title,
        action: {
          onClick: () => toggleAllLiquiditySources(true),
          title: 'Reset',
        },
      },
      description: errorMessages.liquiditySourcesError.description,
    };
  }
  return {
    alert: null,
    description: errorMessages.noRoutesError.description,
  };
}
