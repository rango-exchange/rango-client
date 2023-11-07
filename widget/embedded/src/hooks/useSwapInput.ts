import { useEffect, useRef, useState } from 'react';

import { useAppStore } from '../store/AppStore';
import { useBestRouteStore } from '../store/bestRoute';
import { useSettingsStore } from '../store/settings';
import { debounce } from '../utils/common';
import { isPositiveNumber } from '../utils/numbers';
import { createBestRouteRequestBody } from '../utils/swap';
import { tokensAreEqual } from '../utils/wallets';

import { useFetchBestRoute } from './useFetchBestRoute';

const DEBOUNCE_DELAY = 600;

type UseSwapInput = {
  fetch: () => void;
  loading: boolean;
  error: string;
};

/**
 * a hook for fetching best route based on from and to input values
 * we use this hook in home page
 */
export function useSwapInput(): UseSwapInput {
  const { fetch: fetchBestRoute, cancelFetch } = useFetchBestRoute();
  const {
    config: { liquiditySources, includeNewLiquiditySources },
  } = useAppStore()();
  const [loading, setLoading] = useState(false);
  const {
    fromToken,
    toToken,
    inputAmount,
    inputUsdValue,
    resetRoute,
    setRoute,
  } = useBestRouteStore();
  const {
    slippage,
    customSlippage,
    affiliatePercent,
    affiliateRef,
    affiliateWallets,
    disabledLiquiditySources,
  } = useSettingsStore();
  const [error, setError] = useState('');
  const prevDisabledLiquiditySources = useRef(disabledLiquiditySources);
  const userSlippage = customSlippage ?? slippage;
  const hasTokensValue = !fromToken || !toToken;
  const shouldSkipRequest =
    hasTokensValue ||
    tokensAreEqual(fromToken, toToken) ||
    !isPositiveNumber(inputAmount);

  const fetch: UseSwapInput['fetch'] = () => {
    if (!loading) {
      setLoading(true);
    }
    if (!shouldSkipRequest) {
      resetRoute();
      const requestBody = createBestRouteRequestBody({
        fromToken,
        toToken,
        inputAmount,
        liquiditySources,
        excludeLiquiditySources: includeNewLiquiditySources,
        disabledLiquiditySources,
        slippage: userSlippage,
        affiliateRef,
        affiliatePercent,
        affiliateWallets,
      });
      fetchBestRoute(requestBody)
        .then((res) => {
          setLoading(false);
          setRoute(res);
        })
        .catch((error) => {
          resetRoute();
          if (error?.code !== 'ERR_CANCELED') {
            setError(error.message);
            setLoading(false);
          }
        });
    }
  };

  const debouncedFetch = debounce(() => {
    if (!shouldSkipRequest) {
      fetch();
    }
  }, DEBOUNCE_DELAY);

  useEffect(() => {
    if (!isPositiveNumber(inputAmount) || inputUsdValue?.eq(0)) {
      setLoading(false);
      cancelFetch();
      return;
    }
    if (shouldSkipRequest) {
      return;
    }
    resetRoute();
    setLoading(true);
    debouncedFetch();
    return cancelFetch;
  }, [inputAmount, shouldSkipRequest]);

  useEffect(() => {
    const disabledLiquiditySourceReset =
      !!prevDisabledLiquiditySources.current.length &&
      !disabledLiquiditySources.length;
    if (!shouldSkipRequest && disabledLiquiditySourceReset) {
      fetch();
    }
    prevDisabledLiquiditySources.current = disabledLiquiditySources;
    return cancelFetch;
  }, [disabledLiquiditySources.length]);

  return { fetch, loading, error };
}
