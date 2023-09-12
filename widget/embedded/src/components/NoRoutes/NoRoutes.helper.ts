import type { Info } from './NoRoutes.types';
import type { BestRouteResponse } from 'rango-sdk';

import { errorMessages } from '../../constants/errors';

export function makeInfo(
  data: BestRouteResponse | null,
  disabledLiquiditySources: string[],
  hasError: boolean,
  toggleAllLiquiditySources: (shouldReset: boolean) => void,
  refetchBestRoute: () => void
): Info {
  const diagnosisMessage = data?.diagnosisMessages?.[0];
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
