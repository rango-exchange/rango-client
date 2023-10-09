/* eslint-disable @typescript-eslint/prefer-enum-initializers */
import type { RouteState } from '../store/bestRoute';
import type { SettingsState } from '../store/settings';

interface BestRouteStoreParams {
  fromBlockchain?: RouteState['fromBlockchain'];
  toBlockchain?: RouteState['toBlockchain'];
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
  REQUEST_CANCELED,
}

export type ConfirmSwapError =
  | {
      type: ConfirmSwapErrorTypes.NO_ROUTE;
      diagnosisMessage?: string;
    }
  | {
      type: Exclude<ConfirmSwapErrorTypes, ConfirmSwapErrorTypes.NO_ROUTE>;
    };

export enum RouteWarningType {
  ROUTE_UPDATED,
  ROUTE_SWAPPERS_UPDATED,
  ROUTE_COINS_UPDATED,
  ROUTE_AND_OUTPUT_AMOUNT_UPDATED,
}

export type RouteWarning =
  | {
      type: RouteWarningType.ROUTE_AND_OUTPUT_AMOUNT_UPDATED;
      newOutputAmount: string;
      percentageChange: string;
    }
  | {
      type: Exclude<
        RouteWarningType,
        RouteWarningType.ROUTE_AND_OUTPUT_AMOUNT_UPDATED
      >;
    };

export enum SlippageWarningType {
  INSUFFICIENT_SLIPPAGE,
  HIGH_SLIPPAGE,
}

export type ConfirmSwapWarnings = {
  route: RouteWarning | null;
  balance: { messages: string[] } | null;
  slippage: { type: SlippageWarningType; slippage: string | null } | null;
};
