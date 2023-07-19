import React from 'react';
import { BalanceErrors, MinRequiredSlippage } from '@rango-dev/ui';
import { ConfirmSwapError, ConfirmSwapErrorTypes } from '../types';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';

export function ConfirmSwapErrors(errors: ConfirmSwapError[]) {
  const navigate = useNavigate();

  return errors.flatMap((error) => {
    switch (error.type) {
      case ConfirmSwapErrorTypes.NO_ROUTE:
        return 'No routes found. Please try again later.';
      case ConfirmSwapErrorTypes.REQUEST_FAILED:
        return `Failed to confirm swap ${
          error.status ? `'status': ${error.status})` : ''
        }, please try again.`;

      case ConfirmSwapErrorTypes.ROUTE_UPDATED_WITH_HIGH_VALUE_LOSS:
        return 'Route updated and price impact is too high, try again later!';
      case ConfirmSwapErrorTypes.INSUFFICIENT_SLIPPAGE:
        return (
          <MinRequiredSlippage
            minRequiredSlippage={error.minRequiredSlippage}
            changeSlippage={() => navigate('/' + navigationRoutes.settings)}
          />
        );
      case ConfirmSwapErrorTypes.INSUFFICIENT_BALANCE:
        return <BalanceErrors messages={error.messages} />;
      default:
        return [];
    }
  });
}
