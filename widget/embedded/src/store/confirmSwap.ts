import BigNumber from 'bignumber.js';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { subscribeWithSelector } from 'zustand/middleware';
import { httpService } from '../services/httpService';
import { PendingSwapSettings } from '../types';
import { numberToString } from '../utils/numbers';
import {
  isRouteChanged,
  isNumberOfSwapsChanged,
  isRouteSwappersUpdated,
  isRouteInternalCoinsUpdated,
} from '../utils/routing';
import {
  createBestRouteRequestBody,
  getOutputRatio,
  outputRatioHasWarning,
  isOutputAmountChangedALot,
  getRouteOutputAmount,
  getPercentageChange,
  getBalanceWarnings,
  getMinRequiredSlippage,
  hasProperSlippage,
  calculatePendingSwap,
  getWalletsForNewSwap,
} from '../utils/swap';
import { useBestRouteStore } from './bestRoute';
import { useMetaStore } from './meta';
import createSelectors from './selectors';
import { useSettingsStore } from './settings';
import { useWalletsStore } from './wallets';
import { PendingSwap } from '@rango-dev/ui/dist/containers/History/types';

interface ConfirmSwapState {
  loading: boolean;
  errors: ConfirmSwapError[];
  warnings: ConfirmSwapWarnings[];
  proceedAnyway: boolean;
}

export const useConfirmSwapStore = createSelectors(
  create<ConfirmSwapState>()(
    subscribeWithSelector(() => ({
      loading: false,
      errors: [],
      warnings: [],
      proceedAnyway: false,
    }))
  )
);

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
      minRequiredSlippage: number;
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

export const confirmSwap = async (): Promise<PendingSwap | undefined> => {
  const {
    fromToken,
    toToken,
    inputAmount,
    bestRoute: initialRoute,
    inputUsdValue,
    setBestRoute,
  } = useBestRouteStore.getState();
  const { accounts, selectedWallets } = useWalletsStore.getState();
  const { proceedAnyway } = useConfirmSwapStore.getState();
  const { disabledLiquiditySources, slippage, customSlippage } =
    useSettingsStore.getState();
  const { meta } = useMetaStore.getState();

  const userSlippage = customSlippage || slippage;

  if (!fromToken || !toToken || !inputAmount || !initialRoute) return undefined;

  if (proceedAnyway!) {
    const swapSettings: PendingSwapSettings = {
      slippage: userSlippage.toString(),
      disabledSwappersGroups: disabledLiquiditySources,
    };

    const newSwap = calculatePendingSwap(
      inputAmount.toString(),
      initialRoute,
      getWalletsForNewSwap(selectedWallets),
      swapSettings,
      false,
      meta
    );

    console.log('new swap:', newSwap);

    // queueManager?.create('swap', { swapDetails: newSwap });

    useConfirmSwapStore.setState({
      errors: [],
      warnings: [],
      proceedAnyway: false,
    });

    return newSwap;
  }

  let abortController: AbortController | null = new AbortController();

  useConfirmSwapStore.setState({ loading: true });

  const requestBody = createBestRouteRequestBody(
    fromToken,
    toToken,
    inputAmount,
    accounts,
    selectedWallets,
    disabledLiquiditySources,
    userSlippage,
    true
  );
  const unsubscribeFromBestRouteStore = useBestRouteStore.subscribe(
    (state) => state.bestRoute,
    () => {
      abortController.abort();
    },
    { equalityFn: shallow }
  );
  const unsubscribeFromWalletsStore = useWalletsStore.subscribe(
    (state) => state.selectedWallets,
    () => {
      abortController?.abort();
    },
    {
      equalityFn: (prevState, state) => {
        const selectedWalletsChanged = !state.every(
          (wallet) =>
            !!prevState.find(
              (prevWallet) =>
                wallet.address === prevWallet.address &&
                wallet.chain === prevWallet.chain
            )
        );

        if (selectedWalletsChanged) return false;
        else return true;
      },
    }
  );

  const newSwap: PendingSwap | undefined | void = await httpService
    .getBestRoute(requestBody, { signal: abortController.signal })
    .then((confiremedRoute) => {
      useConfirmSwapStore.setState({ loading: false });

      if (
        !confiremedRoute.result ||
        !new BigNumber(confiremedRoute.requestAmount).isEqualTo(
          new BigNumber(inputAmount || '-1')
        )
      ) {
        useConfirmSwapStore.setState((prevState) => ({
          errors: prevState.errors.concat({
            type: ConfirmSwapErrorTypes.NO_ROUTE,
          }),
        }));
        return undefined;
      }

      const confirmSwap: Partial<ConfirmSwapState> = {
        loading: false,
        errors: [],
        warnings: [],
        proceedAnyway,
      };

      const routeChanged = isRouteChanged(initialRoute, confiremedRoute!);

      if (routeChanged) {
        setBestRoute(confiremedRoute);
        const newRouteOutputUsdValue = new BigNumber(
          confiremedRoute.result?.outputAmount || '0'
        ).multipliedBy(toToken.usdPrice || 0);

        const outputRatio = getOutputRatio(
          inputUsdValue,
          newRouteOutputUsdValue
        );
        const highValueLoss = outputRatioHasWarning(inputUsdValue, outputRatio);

        if (isNumberOfSwapsChanged(initialRoute, confiremedRoute))
          confirmSwap.warnings.push({
            type: ConfirmSwapWarningTypes.ROUTE_UPDATED,
          });
        else if (isRouteSwappersUpdated(initialRoute, confiremedRoute))
          confirmSwap.warnings.push({
            type: ConfirmSwapWarningTypes.ROUTE_SWAPPERS_UPDATED,
          });
        else isRouteInternalCoinsUpdated(initialRoute, confiremedRoute);
        confirmSwap.warnings.push({
          type: ConfirmSwapWarningTypes.ROUTE_COINS_UPDATED,
        });
        if (highValueLoss)
          confirmSwap.errors.push({
            type: ConfirmSwapErrorTypes.ROUTE_UPDATED_WITH_HIGH_VALUE_LOSS,
          });
        else if (isOutputAmountChangedALot(initialRoute, confiremedRoute))
          confirmSwap.warnings.push({
            type: ConfirmSwapWarningTypes.ROUTE_AND_OUTPUT_AMOUNT_UPDATED,
            newOutputAmount: numberToString(
              getRouteOutputAmount(confiremedRoute)
            ),
            percentageChange: numberToString(
              getPercentageChange(
                getRouteOutputAmount(initialRoute),
                getRouteOutputAmount(confiremedRoute)
              ),
              null,
              2
            ),
          });
      }

      const balanceWarnings = getBalanceWarnings(
        confiremedRoute,
        selectedWallets
      );
      const enoughBalance = balanceWarnings.length === 0;

      if (!enoughBalance)
        confirmSwap.warnings.push({
          type: ConfirmSwapWarningTypes.INSUFFICIENT_BALANCE,
          messages: balanceWarnings,
        });

      const minRequiredSlippage = getMinRequiredSlippage(initialRoute);

      if (!hasProperSlippage(userSlippage.toString(), minRequiredSlippage))
        confirmSwap.errors.push({
          type: ConfirmSwapErrorTypes.INSUFFICIENT_SLIPPAGE,
          minRequiredSlippage,
        });

      const noErrors = confirmSwap.errors.length === 0;
      const noWarnings = confirmSwap.warnings.length === 0;

      if (
        (noErrors || (!noErrors && proceedAnyway)) &&
        (noWarnings || (!noWarnings && proceedAnyway))
      ) {
        const swapSettings: PendingSwapSettings = {
          slippage: userSlippage.toString(),
          disabledSwappersGroups: disabledLiquiditySources,
        };

        const newSwap = calculatePendingSwap(
          inputAmount.toString(),
          confiremedRoute,
          getWalletsForNewSwap(selectedWallets),
          swapSettings,
          false,
          meta
        );

        console.log('new swap:', newSwap);
        return newSwap;
      } else if (!proceedAnyway) {
        confirmSwap.proceedAnyway = true;
        useConfirmSwapStore.setState(confirmSwap);
      }
      return undefined;
    })
    .then((result) => {
      abortController = null;
      unsubscribeFromBestRouteStore();
      unsubscribeFromWalletsStore();
      return result;
    })
    .catch((error) => {
      abortController = null;
      if (error.code === 'ERR_CANCELED') {
        useConfirmSwapStore.setState({
          errors: [],
          warnings: [],
          loading: false,
          proceedAnyway: false,
        });
        unsubscribeFromBestRouteStore();
        unsubscribeFromWalletsStore();
      }

      const status = error.response?.status;

      useConfirmSwapStore.setState((prevState) => ({
        loading: false,
        errors: prevState.errors.concat({
          type: ConfirmSwapErrorTypes.REQUEST_FAILED,
          status,
        }),
      }));
    });

  return newSwap || undefined;
};
