import { ConfirmSwapWarningTypes, ConfirmSwapWarnings } from '../types';

export function ConfirmSwapWarnings(warnings: ConfirmSwapWarnings[]) {
  return warnings.flatMap((warning) => {
    switch (warning.type) {
      case ConfirmSwapWarningTypes.ROUTE_UPDATED:
        return "Route has been updated.";
      case ConfirmSwapWarningTypes.ROUTE_AND_OUTPUT_AMOUNT_UPDATED:
        return (
          `Output amount changed to ${warning.newOutputAmount} (${warning.percentageChange}% change).`
        );

      case ConfirmSwapWarningTypes.ROUTE_SWAPPERS_UPDATED:
        return (
          "Route swappers has been updated."
        );
      case ConfirmSwapWarningTypes.ROUTE_COINS_UPDATED:
        return (
          "Route internal coins has been updated."
        );
      default:
        return [];
    }
  });
}
