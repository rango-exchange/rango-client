import { RouteState } from '../store/bestRoute';
import { SettingsState } from '../store/settings';

interface BestRouteStoreParams {
  fromChain?: RouteState['fromChain'];
  toChain?: RouteState['toChain'];
  fromToken?: RouteState['fromToken'];
  toToken?: RouteState['toToken'];
  inputAmount?: RouteState['inputAmount'];
}

interface SettingsStoreParams {
  slippage?: SettingsState['slippage'];
  customSlippage?: SettingsState['customSlippage'];
  disabledLiquiditySources?: SettingsState['disabledLiquiditySources'];
  infiniteApprove?: SettingsState['infiniteApprove'];
}

export type BestRouteEqualityParams =
  | {
      store: 'bestRoute';
      prevState: BestRouteStoreParams;
      currentState: BestRouteStoreParams;
    }
  | {
      store: 'settings';
      prevState: SettingsStoreParams;
      currentState: SettingsStoreParams;
    };

export enum ConfirmSwapErrorTypes {
  NO_ROUTE,
  ROUTE_UPDATED_WITH_HIGH_VALUE_LOSS,
  REQUEST_FAILED,
  INSUFFICIENT_SLIPPAGE,
  INSUFFICIENT_BALANCE,
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
  | { type: ConfirmSwapErrorTypes.INSUFFICIENT_BALANCE; messages: string[] }
  | {
      type: Exclude<
        ConfirmSwapErrorTypes,
        | ConfirmSwapErrorTypes.REQUEST_FAILED
        | ConfirmSwapErrorTypes.INSUFFICIENT_SLIPPAGE
        | ConfirmSwapErrorTypes.INSUFFICIENT_BALANCE
      >;
    };

export type ConfirmSwapWarnings =
  | {
      type: ConfirmSwapWarningTypes.ROUTE_AND_OUTPUT_AMOUNT_UPDATED;
      newOutputAmount: string;
      percentageChange: string;
    }
  | {
      type: Exclude<
        ConfirmSwapWarningTypes,
        ConfirmSwapWarningTypes.ROUTE_AND_OUTPUT_AMOUNT_UPDATED
      >;
    };

export enum ConfirmSwapWarningTypes {
  ROUTE_UPDATED,
  ROUTE_SWAPPERS_UPDATED,
  ROUTE_COINS_UPDATED,
  ROUTE_AND_OUTPUT_AMOUNT_UPDATED,
}
