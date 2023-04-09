import React from 'react';
import { Typography } from '@rango-dev/ui';
import { ConfirmSwapWarningTypes, ConfirmSwapWarnings } from '../types';
import { BalanceWarnings } from './warnings/BalanceWarnings';

export function ConfirmSwapWarnings(warnings: ConfirmSwapWarnings[]) {
  return warnings.flatMap((warning) => {
    switch (warning.type) {
      case ConfirmSwapWarningTypes.ROUTE_UPDATED:
        return <Typography variant="body2">Route has been updated.</Typography>;
      case ConfirmSwapWarningTypes.ROUTE_AND_OUTPUT_AMOUNT_UPDATED:
        return (
          <Typography variant="body2">{`Output amount changed to ${warning.newOutputAmount} 
      (${warning.percentageChange}% change).`}</Typography>
        );

      case ConfirmSwapWarningTypes.ROUTE_SWAPPERS_UPDATED:
        return (
          <Typography variant="body2">
            Route swappers has been updated.
          </Typography>
        );
      case ConfirmSwapWarningTypes.ROUTE_COINS_UPDATED:
        return (
          <Typography variant="body2">
            Route internal coins has been updated.
          </Typography>
        );
      case ConfirmSwapWarningTypes.INSUFFICIENT_BALANCE:
        return <BalanceWarnings messages={warning.messages} />;
      default:
        return [];
    }
  });
}
