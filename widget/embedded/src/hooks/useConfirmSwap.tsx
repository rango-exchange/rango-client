import React, { useRef } from 'react';
import { PendingSwap } from '@rangodev/ui/dist/containers/History/types';
import { SwapSavedSettings } from '@rangodev/ui/dist/types/swaps';
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
  getWalletsForNewSwap,
  hasEnoughBalanceAndProperSlippage,
  hasProperSlippage,
} from '../utils/swap';
import { Typography } from '@rangodev/ui';
import { ChangeSlippageButton } from '../components/ChangeSlippageButton';

export function useConfirmSwap() {
  const fromToken = useBestRouteStore.use.fromToken();
  const toToken = useBestRouteStore.use.toToken();
  const inputAmount = useBestRouteStore.use.inputAmount();
  const bestRoute = useBestRouteStore.use.bestRoute();
  const setBestRoute = useBestRouteStore.use.setBestRoute();
  const accounts = useWalletsStore.use.accounts();
  const selectedWallets = useWalletsStore.use.selectedWallets();
  const tokens = useMetaStore.use.meta().tokens;

  const slippage = useSettingsStore.use.slippage();
  const customSlippage = useSettingsStore.use.customSlippage();
  const disabledLiquiditySources = useSettingsStore.use.disabledLiquiditySources();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ReactNode>(null);
  const [warning, setWarning] = useState<ReactNode>(null);
  const [enoughBalance, setEnoughBalance] = useState<boolean | null>(null);
  const [minRequiredSlippage, setMinRequiredSlippage] = useState<null | number>(null);
  const userSlippage = customSlippage || slippage;
  const swapConfirmed = useRef(false);

  if (!fromToken || !toToken || !inputAmount || !bestRoute)
    return { loading: false, error: '', warning: '', data: null, swap: () => {} };

  const swap = async () => {
    try {
      setLoading(true);

      const requestBody = createBestRouteRequestBody(
        fromToken,
        toToken,
        inputAmount,
        accounts,
        selectedWallets,
        disabledLiquiditySources,
      );

      const confirmBestRoute = await httpService.getBestRoute(requestBody);
      setLoading(false);
      if (!confirmBestRoute || !confirmBestRoute.result || !bestRoute) setError('no routes found');
      if (
        !!confirmBestRoute &&
        !new BigNumber(confirmBestRoute.requestAmount).isEqualTo(new BigNumber(inputAmount || '-1'))
      )
        setError('No routes found. Please try again later.');
      const routeChanged = isRouteChanged(bestRoute, confirmBestRoute!);
      setBestRoute(confirmBestRoute!);
      if (routeChanged) {
        if (isNumberOfSwapsChanged(bestRoute, confirmBestRoute))
          setWarning('Route has been updated.');
        if (isRouteSwappersUpdated(bestRoute, confirmBestRoute))
          setWarning('Route swappers has been updated.');
        if (isRouteInternalCoinsUpdated(bestRoute, confirmBestRoute))
          setWarning('Route internal coins has been updated.');
      }

      if (!hasProperSlippage(userSlippage.toString(), minRequiredSlippage))
        setError(
          <Typography variant="body2">
            Your slippage should be {minRequiredSlippage} at least
            <ChangeSlippageButton />
          </Typography>,
        );

      if (
        hasEnoughBalanceAndProperSlippage(
          bestRoute,
          selectedWallets,
          userSlippage.toString(),
          minRequiredSlippage,
        ) &&
        (!routeChanged || (routeChanged && swapConfirmed.current))
      ) {
        const settings: Omit<SwapSavedSettings, 'disabledSwappersIds'> = {
          slippage: userSlippage.toString(),
          disabledSwappersGroups: disabledLiquiditySources,
        };
        const newSwap: PendingSwap = calculatePendingSwap(
          inputAmount!.toString(),
          bestRoute!,
          getWalletsForNewSwap(selectedWallets),
          settings,
          false,
          tokens,
        );
      } else if (!swapConfirmed.current) swapConfirmed.current = true;
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) setError(error.message);
      else setError('');
    }
  };

  return {
    loading,
    error,
    warning,
    swap,
  };
}
