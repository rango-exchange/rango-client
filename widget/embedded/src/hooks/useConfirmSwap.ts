/* eslint-disable @typescript-eslint/no-magic-numbers */
import type {
  ConfirmSwapError,
  ConfirmSwapWarnings,
  PendingSwapSettings,
  Wallet,
} from '../types';
import type { PendingSwap } from '@rango-dev/queue-manager-rango-preset';
import type { BestRouteResponse } from 'rango-sdk';

import { calculatePendingSwap } from '@rango-dev/queue-manager-rango-preset';
import BigNumber from 'bignumber.js';
import { useEffect } from 'react';

import { HIGH_SLIPPAGE } from '../constants/swapSettings';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { useWalletsStore } from '../store/wallets';
import {
  ConfirmSwapErrorTypes,
  RouteWarningType,
  SlippageWarningType,
} from '../types';
import { numberToString } from '../utils/numbers';
import {
  isNumberOfSwapsChanged,
  isRouteChanged,
  isRouteInternalCoinsUpdated,
  isRouteSwappersUpdated,
} from '../utils/routing';
import {
  createBestRouteRequestBody,
  getBalanceWarnings,
  getMinRequiredSlippage,
  getOutputRatio,
  getPercentageChange,
  getRouteOutputAmount,
  getWalletsForNewSwap,
  hasProperSlippage,
  isOutputAmountChangedALot,
  outputRatioHasWarning,
} from '../utils/swap';

import { useFetchBestRoute } from './useFetchBestRoute';

export type ConfirmSwapFetchResult = {
  swap: PendingSwap | null;
  error: ConfirmSwapError | null;
  warnings: ConfirmSwapWarnings | null;
};

export type ConfirmSwap = {
  loading: boolean;
  fetch: (params: Params) => Promise<ConfirmSwapFetchResult>;
  cancelFetch: () => void;
};

type Params = {
  selectedWallets: Wallet[];
  customDestination?: string;
};

/**
 * A request can be successful but in body of the response, it can be some case which is considered as failed.
 */
function throwErrorIfResponseIsNotValid(
  response: BestRouteResponse,
  params: { inputUsdValue: BigNumber | null; outputUsdValue: number | null }
) {
  if (!response.result) {
    throw new Error('Route not found', {
      cause: {
        type: ConfirmSwapErrorTypes.NO_ROUTE,
      },
    });
  }

  const newRouteOutputUsdValue = new BigNumber(
    response.result?.outputAmount || '0'
  ).multipliedBy(params.outputUsdValue || 0);

  const outputRatio = getOutputRatio(
    params.inputUsdValue,
    newRouteOutputUsdValue
  );
  const highValueLoss = outputRatioHasWarning(
    params.inputUsdValue,
    outputRatio
  );

  if (highValueLoss) {
    throw new Error('High value loss for route', {
      cause: {
        type: ConfirmSwapErrorTypes.ROUTE_UPDATED_WITH_HIGH_VALUE_LOSS,
      },
    });
  }

  return response;
}

function generateWarnings(
  previousRoute: BestRouteResponse,
  currentRoute: BestRouteResponse,
  params: {
    selectedWallets: Wallet[];
    userSlippage: number;
  }
): ConfirmSwapWarnings {
  const routeChanged = isRouteChanged(previousRoute, currentRoute);
  const output: ConfirmSwapWarnings = {
    balance: null,
    route: null,
    slippage: null,
  };

  if (routeChanged) {
    if (isOutputAmountChangedALot(previousRoute, currentRoute)) {
      output.route = {
        type: RouteWarningType.ROUTE_AND_OUTPUT_AMOUNT_UPDATED,
        newOutputAmount: numberToString(getRouteOutputAmount(currentRoute)),
        percentageChange: numberToString(
          getPercentageChange(
            getRouteOutputAmount(previousRoute),
            getRouteOutputAmount(currentRoute)
          ),
          null,
          2
        ),
      };
    } else if (isRouteInternalCoinsUpdated(previousRoute, currentRoute)) {
      output.route = {
        type: RouteWarningType.ROUTE_COINS_UPDATED,
      };
    } else if (isNumberOfSwapsChanged(previousRoute, currentRoute)) {
      output.route = {
        type: RouteWarningType.ROUTE_UPDATED,
      };
    } else if (isRouteSwappersUpdated(previousRoute, currentRoute)) {
      output.route = {
        type: RouteWarningType.ROUTE_SWAPPERS_UPDATED,
      };
    }
  }

  const balanceWarnings = getBalanceWarnings(
    currentRoute,
    params.selectedWallets
  );
  const enoughBalance = balanceWarnings.length === 0;

  if (!enoughBalance) {
    output.balance = {
      messages: balanceWarnings,
    };
  }

  const minRequiredSlippage = getMinRequiredSlippage(previousRoute);
  const highSlippage = params.userSlippage > HIGH_SLIPPAGE;

  if (!hasProperSlippage(params.userSlippage.toString(), minRequiredSlippage)) {
    output.slippage = {
      type: SlippageWarningType.INSUFFICIENT_SLIPPAGE,
      slippage: minRequiredSlippage,
    };
  } else if (highSlippage) {
    output.slippage = {
      type: SlippageWarningType.HIGH_SLIPPAGE,
      slippage: params.userSlippage.toString(),
    };
  }

  return output;
}

export function useConfirmSwap(): ConfirmSwap {
  const {
    fromToken,
    toToken,
    inputAmount,
    inputUsdValue,
    bestRoute: initialRoute,
  } = useBestRouteStore();

  const {
    slippage,
    customSlippage,
    affiliatePercent,
    affiliateRef,
    affiliateWallets,
    disabledLiquiditySources,
  } = useSettingsStore();
  const { connectedWallets, customDestination: customDestinationFromStore } =
    useWalletsStore();

  const { meta } = useMetaStore();

  const userSlippage = customSlippage || slippage;

  const { fetch: fetchBestRoute, cancelFetch, loading } = useFetchBestRoute();

  useEffect(() => cancelFetch, []);

  const fetch: ConfirmSwap['fetch'] = async (params: Params) => {
    const selectedWallets = params.selectedWallets;
    const customDestination =
      params?.customDestination ?? customDestinationFromStore;

    if (!fromToken || !toToken || !inputAmount || !initialRoute) {
      return {
        swap: null,
        error: null,
        warnings: null,
      };
    }

    const requestBody = createBestRouteRequestBody({
      fromToken,
      toToken,
      inputAmount,
      wallets: connectedWallets,
      selectedWallets,
      disabledLiquiditySources,
      slippage: userSlippage,
      affiliateRef,
      affiliatePercent,
      affiliateWallets,
      initialRoute,
      destination: customDestination,
    });

    let currentRoute: BestRouteResponse;
    try {
      currentRoute = await fetchBestRoute(requestBody).then((response) =>
        throwErrorIfResponseIsNotValid(response, {
          outputUsdValue: toToken.usdPrice,
          inputUsdValue,
        })
      );
    } catch (error: any) {
      if (error?.code === 'ERR_CANCELED') {
        return {
          swap: null,
          error: {
            type: ConfirmSwapErrorTypes.REQUEST_CANCELED,
          },
          warnings: null,
        };
      }

      if (error.cause) {
        return {
          swap: null,
          error: {
            type: error.cause,
          },
          warnings: null,
        };
      }

      const status = error?.response?.status;
      return {
        swap: null,
        error: {
          type: ConfirmSwapErrorTypes.REQUEST_FAILED,
          status: status,
        },
        warnings: null,
      };
    }

    const swapSettings: PendingSwapSettings = {
      slippage: userSlippage.toString(),
      disabledSwappersGroups: disabledLiquiditySources,
    };
    const swap = calculatePendingSwap(
      inputAmount.toString(),
      currentRoute,
      getWalletsForNewSwap(selectedWallets),
      swapSettings,
      false,
      meta
    );

    return {
      swap,
      error: null,
      warnings: generateWarnings(initialRoute, currentRoute, {
        selectedWallets,
        userSlippage,
      }),
    };
  };

  return {
    loading,
    fetch,
    cancelFetch,
  };
}
