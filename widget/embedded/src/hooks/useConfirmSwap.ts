import { useEffect, useRef, useState } from 'react';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { useWalletsStore } from '../store/wallets';
import {
  ConfirmSwapError,
  ConfirmSwapErrorTypes,
  ConfirmSwapWarningTypes,
  ConfirmSwapWarnings,
  PendingSwapSettings,
} from '../types';
import { PendingSwap } from '@rango-dev/ui/dist/containers/History/types';
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
import { httpService } from '../services/httpService';
import BigNumber from 'bignumber.js';
import {
  isNumberOfSwapsChanged,
  isRouteChanged,
  isRouteInternalCoinsUpdated,
  isRouteSwappersUpdated,
} from '../utils/routing';
import { numberToString } from '../utils/numbers';
import { BestRouteResponse } from 'rango-sdk';
import { calculatePendingSwap } from '@rango-dev/queue-manager-rango-preset';

type ConfirmSwap = {
  loading: boolean;
  errors: ConfirmSwapError[];
  warnings: ConfirmSwapWarnings[];
  confirmSwap: (() => Promise<PendingSwap | undefined>) | null;
};

export function useConfirmSwap(): ConfirmSwap {
  const fromToken = useBestRouteStore.use.fromToken();
  const toToken = useBestRouteStore.use.toToken();
  const inputAmount = useBestRouteStore.use.inputAmount();
  const initialRoute = useBestRouteStore.use.bestRoute();
  const setBestRoute = useBestRouteStore.use.setBestRoute();
  const inputUsdValue = useBestRouteStore.use.inputUsdValue();
  const affiliateRef = useSettingsStore.use.affiliateRef();

  const accounts = useWalletsStore.use.accounts();
  const selectedWallets = useWalletsStore.use.selectedWallets();
  const meta = useMetaStore.use.meta();
  const customSlippage = useSettingsStore.use.customSlippage();
  const slippage = useSettingsStore.use.slippage();
  const disabledLiquiditySources =
    useSettingsStore.use.disabledLiquiditySources();
  const userSlippage = customSlippage || slippage;
  const proceedAnywayRef = useRef(false);
  const confiremedRouteRef = useRef<BestRouteResponse | null>(null);
  let abortControllerRef = useRef<AbortController | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ConfirmSwapError[]>([]);
  const [warnings, setWarnings] = useState<ConfirmSwapWarnings[]>([]);

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  if (!fromToken || !toToken || !inputAmount || !initialRoute)
    return { loading: false, warnings: [], errors: [], confirmSwap: null };

  const confirmSwap = async (): Promise<PendingSwap | undefined> => {
    if (proceedAnywayRef.current) {
      const swapSettings: PendingSwapSettings = {
        slippage: userSlippage.toString(),
        disabledSwappersGroups: disabledLiquiditySources,
      };

      if (errors.length > 0) setErrors([]);
      if (warnings.length > 0) setWarnings([]);
      proceedAnywayRef.current = false;

      if (confiremedRouteRef.current) {
        const newSwap = calculatePendingSwap(
          inputAmount.toString(),
          confiremedRouteRef.current,
          getWalletsForNewSwap(selectedWallets),
          swapSettings,
          false,
          meta
        );

        return newSwap;
      }
      return;
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);

    const requestBody = createBestRouteRequestBody(
      fromToken,
      toToken,
      inputAmount,
      accounts,
      selectedWallets,
      disabledLiquiditySources,
      userSlippage,
      true,
      affiliateRef
    );

    try {
      const confiremedRoute = await httpService().getBestRoute(requestBody, {
        signal: abortControllerRef.current?.signal,
      });

      abortControllerRef.current = null;

      setLoading(false);

      if (
        !confiremedRoute.result ||
        !new BigNumber(confiremedRoute.requestAmount).isEqualTo(
          new BigNumber(inputAmount || '-1')
        )
      ) {
        setErrors((prevState) =>
          prevState.concat({
            type: ConfirmSwapErrorTypes.NO_ROUTE,
          })
        );
        return;
      }

      const confirmSwapState: Omit<ConfirmSwap, 'confirmSwap' | 'loading'> = {
        errors: [],
        warnings: [],
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

        if (highValueLoss)
          confirmSwapState.errors.push({
            type: ConfirmSwapErrorTypes.ROUTE_UPDATED_WITH_HIGH_VALUE_LOSS,
          });
        else if (isOutputAmountChangedALot(initialRoute, confiremedRoute))
          confirmSwapState.warnings.push({
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
        else if (isRouteInternalCoinsUpdated(initialRoute, confiremedRoute))
          confirmSwapState.warnings.push({
            type: ConfirmSwapWarningTypes.ROUTE_COINS_UPDATED,
          });
        else if (isNumberOfSwapsChanged(initialRoute, confiremedRoute))
          confirmSwapState.warnings.push({
            type: ConfirmSwapWarningTypes.ROUTE_UPDATED,
          });
        else if (isRouteSwappersUpdated(initialRoute, confiremedRoute))
          confirmSwapState.warnings.push({
            type: ConfirmSwapWarningTypes.ROUTE_SWAPPERS_UPDATED,
          });
      }

      const balanceWarnings = getBalanceWarnings(
        confiremedRoute,
        selectedWallets
      );
      const enoughBalance = balanceWarnings.length === 0;

      if (!enoughBalance)
        confirmSwapState.warnings.push({
          type: ConfirmSwapWarningTypes.INSUFFICIENT_BALANCE,
          messages: balanceWarnings,
        });

      const minRequiredSlippage = getMinRequiredSlippage(initialRoute);

      if (!hasProperSlippage(userSlippage.toString(), minRequiredSlippage))
        confirmSwapState.errors.push({
          type: ConfirmSwapErrorTypes.INSUFFICIENT_SLIPPAGE,
          minRequiredSlippage,
        });

      const noErrors = confirmSwapState.errors.length === 0;
      const noWarnings = confirmSwapState.warnings.length === 0;

      if (
        (noErrors || (!noErrors && proceedAnywayRef.current)) &&
        (noWarnings || (!noWarnings && proceedAnywayRef.current))
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
        return newSwap;
      } else if (!proceedAnywayRef.current) {
        proceedAnywayRef.current = true;
        setErrors(confirmSwapState.errors);
        setWarnings(confirmSwapState.warnings);
        confiremedRouteRef.current = confiremedRoute;
      }
      return;
    } catch (error) {
      if ((error as any)?.code === 'ERR_CANCELED') {
        return;
      }

      const status = (error as any)?.response?.status;

      setLoading(false);
      setErrors([
        {
          type: ConfirmSwapErrorTypes.REQUEST_FAILED,
          status,
        },
      ]);

      return;
    }
  };

  return { loading, warnings, errors, confirmSwap };
}
