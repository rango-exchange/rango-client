import React from 'react';
import { ConfirmSwapError, ConfirmSwapErrorTypes } from '../types';
import { MinRequiredSlippage } from './warnings/MinRequiredSlippage';
import { BalanceErrors } from './warnings/BalanceErrors';

export function ConfirmSwapErrors(errors: ConfirmSwapError[]) {
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
          />
        );
      case ConfirmSwapErrorTypes.INSUFFICIENT_BALANCE:
        return <BalanceErrors messages={error.messages} />;
      default:
        return [];
    }
  });
}
