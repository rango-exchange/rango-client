import { RouteState } from '../store/bestRoute';
import { SettingsState } from '../store/settings';

export interface BestRouteParams {
  fromChain?: RouteState['fromChain'];
  toChain?: RouteState['toChain'];
  fromToken?: RouteState['fromToken'];
  toToken?: RouteState['toToken'];
  inputAmount?: RouteState['inputAmount'];
  slippage?: SettingsState['slippage'];
  customSlippage?: SettingsState['customSlippage'];
  disabledLiquiditySources?: SettingsState['disabledLiquiditySources'];
}

export enum ConfirmSwapErrorTypes {
  NO_ROUTE,
  ROUTE_UPDATED_WITH_HIGH_VALUE_LOSS,
  REQUEST_FAILED,
  INSUFFICIENT_SLIPPAGE,
}

export type ConfirmSwapError =
  | {
      type: ConfirmSwapErrorTypes.REQUEST_FAILED;
      status?: number;
    }
  | {
      type: ConfirmSwapErrorTypes.INSUFFICIENT_SLIPPAGE;
      minRequiredSlippage: string | null;
    }
  | {
      type: Exclude<
        ConfirmSwapErrorTypes,
        | ConfirmSwapErrorTypes.REQUEST_FAILED
        | ConfirmSwapErrorTypes.INSUFFICIENT_SLIPPAGE
      >;
    };

export type ConfirmSwapWarnings =
  | {
      type: ConfirmSwapWarningTypes.ROUTE_AND_OUTPUT_AMOUNT_UPDATED;
      newOutputAmount: string;
      percentageChange: string;
    }
  | { type: ConfirmSwapWarningTypes.INSUFFICIENT_BALANCE; messages: string[] }
  | {
      type: Exclude<
        ConfirmSwapWarningTypes,
        | ConfirmSwapWarningTypes.ROUTE_AND_OUTPUT_AMOUNT_UPDATED
        | ConfirmSwapWarningTypes.INSUFFICIENT_BALANCE
      >;
    };

export enum ConfirmSwapWarningTypes {
  ROUTE_UPDATED,
  ROUTE_SWAPPERS_UPDATED,
  ROUTE_COINS_UPDATED,
  ROUTE_AND_OUTPUT_AMOUNT_UPDATED,
  INSUFFICIENT_BALANCE,
}
