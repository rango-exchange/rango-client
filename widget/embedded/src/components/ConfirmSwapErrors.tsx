import React from 'react';
import { Typography } from '@rango-dev/ui';
import { ConfirmSwapError, ConfirmSwapErrorTypes } from '../store/confirmSwap';
import { MinRequiredSlippage } from './warnings/MinRequiredSlippage';

export function ConfirmSwapErrors(errors: ConfirmSwapError[]) {
  return errors.flatMap((error) => {
    switch (error.type) {
      case ConfirmSwapErrorTypes.NO_ROUTE:
        return (
          <Typography variant="body2">
            No routes found. Please try again later.
          </Typography>
        );
      case ConfirmSwapErrorTypes.REQUEST_FAILED:
        return (
          <Typography variant="body2">{`Failed to confirm swap ${
            error.status ? `'status': ${error.status})` : ''
          }, please try again.`}</Typography>
        );

      case ConfirmSwapErrorTypes.ROUTE_UPDATED_WITH_HIGH_VALUE_LOSS:
        return (
          <Typography variant="body2">
            Route updated and price impact is too high, try again later!
          </Typography>
        );
      case ConfirmSwapErrorTypes.INSUFFICIENT_SLIPPAGE:
        return (
          <MinRequiredSlippage
            minRequiredSlippage={error.minRequiredSlippage}
          />
        );
      default:
        return [];
    }
  });
}
