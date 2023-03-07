import { useRef } from 'react';
import { PendingSwap } from '@rango-dev/ui/dist/containers/History/types';
import BigNumber from 'bignumber.js';
import { ReactNode, useState } from 'react';
import { httpService } from '../services/httpService';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useSettingsStore } from '../store/settings';
import { useWalletsStore } from '../store/wallets';
import {
  isNumberOfSwapsChanged,
  isRouteChanged,
  isRouteInternalCoinsUpdated,
  isRouteSwappersUpdated,
} from '../utils/routing';
import {
  calculatePendingSwap,
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
import { numberToString } from '../utils/numbers';
import { MinRequiredSlippage } from '../components/warnings/MinRequiredSlippage';
import { PendingSwapSettings } from '../types';
import { BalanceWarnings } from '../components/warnings/BalanceWarnings';

export function useConfirmSwap() {
  const fromToken = useBestRouteStore.use.fromToken();
  const toToken = useBestRouteStore.use.toToken();
  const inputAmount = useBestRouteStore.use.inputAmount();
  const inputUsdValue = useBestRouteStore.use.inputUsdValue();
  const bestRoute = useBestRouteStore.use.bestRoute();
  const setBestRoute = useBestRouteStore.use.setBestRoute();
  const accounts = useWalletsStore.use.accounts();
  const selectedWallets = useWalletsStore.use.selectedWallets();
  const tokens = useMetaStore.use.meta().tokens;

  const slippage = useSettingsStore.use.slippage();
  const customSlippage = useSettingsStore.use.customSlippage();
  const disabledLiquiditySources =
    useSettingsStore.use.disabledLiquiditySources();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ReactNode[]>([]);
  const [warnings, setWarnings] = useState<ReactNode[]>([]);
  const userSlippage = customSlippage || slippage;
  const swapConfirmed = useRef(false);
  const addError = (error: ReactNode) =>
    setErrors((prevState) => prevState.concat(error));
  const addWarning = (warning: ReactNode) =>
    setWarnings((prevState) => prevState.concat(warning));

  if (!fromToken || !toToken || !inputAmount || !bestRoute)
    return { loading: false, errors: [], warnings: [], data: null, swap: null };

  const swap = async () => {
    try {
      setLoading(true);

      const requestBody = createBestRouteRequestBody(
        fromToken,
        toToken,
        inputAmount,
        accounts,
        selectedWallets,
        disabledLiquiditySources
      );

      const confirmBestRoute = await httpService.getBestRoute(requestBody);
      setLoading(false);
      if (!confirmBestRoute || !confirmBestRoute.result || !bestRoute)
        addError('no routes found');
      if (
        !!confirmBestRoute &&
        !new BigNumber(confirmBestRoute.requestAmount).isEqualTo(
          new BigNumber(inputAmount || '-1')
        )
      )
        addError('No routes found. Please try again later.');
      const routeChanged = isRouteChanged(bestRoute, confirmBestRoute!);

      setBestRoute(confirmBestRoute!);
      if (routeChanged) {
        const newRouteOutputUsdValue = new BigNumber(
          confirmBestRoute.result?.outputAmount || '0'
        ).multipliedBy(toToken.usdPrice || 0);

        const outputRatio = getOutputRatio(
          inputUsdValue,
          newRouteOutputUsdValue
        );
        const highValueLoss = outputRatioHasWarning(inputUsdValue, outputRatio);

        if (isNumberOfSwapsChanged(bestRoute, confirmBestRoute))
          addWarning('Route has been updated.');
        if (isRouteSwappersUpdated(bestRoute, confirmBestRoute))
          addWarning('Route swappers has been updated.');
        if (isRouteInternalCoinsUpdated(bestRoute, confirmBestRoute))
          addWarning('Route internal coins has been updated.');
        if (highValueLoss)
          addError(
            'Route updated and price impact is too high, try again later!'
          );
        if (isOutputAmountChangedALot(bestRoute, confirmBestRoute))
          addWarning(`Output amount changed to ${numberToString(
            getRouteOutputAmount(confirmBestRoute)
          )} 
      (${numberToString(
        getPercentageChange(
          getRouteOutputAmount(bestRoute)!,
          getRouteOutputAmount(confirmBestRoute)!
        ),
        null,
        2
      )}% change).`);
      }

      const balanceWarnings = getBalanceWarnings(
        confirmBestRoute,
        selectedWallets
      );
      const enoughBalance = balanceWarnings.length === 0;

      if (!enoughBalance) addWarning(BalanceWarnings(balanceWarnings));

      const minRequiredSlippage = getMinRequiredSlippage(bestRoute);
      if (!hasProperSlippage(userSlippage.toString(), minRequiredSlippage))
        addError(MinRequiredSlippage(minRequiredSlippage));

      if (!routeChanged || (routeChanged && swapConfirmed.current)) {
        const swapSettings: PendingSwapSettings = {
          slippage: userSlippage.toString(),
          disabledSwappersGroups: disabledLiquiditySources,
        };
        const newSwap: PendingSwap = calculatePendingSwap(
          inputAmount!.toString(),
          bestRoute!,
          getWalletsForNewSwap(selectedWallets),
          swapSettings,
          false,
          tokens
        );
        console.log('new swap:', newSwap);
      } else if (!swapConfirmed.current) swapConfirmed.current = true;
    } catch (error) {
      setLoading(false);
      if (error.message) addError(error.message);
      else if (!!error.response)
        addError(
          `Failed to confirm swap 'status': ${error.response.status}), please try again.`
        );
      else addError('Failed to confirm swap, please try again.');
    }
  };

  return {
    loading,
    errors,
    warnings,
    swap,
  };
}
