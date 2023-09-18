import { useEffect, useState } from 'react';

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
  const { fetch: fetchBestRoute, cancelFetch, loading } = useFetchBestRoute();
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
  const userSlippage = customSlippage ?? slippage;
  const hasTokensValue = !fromToken || !toToken;
  const shouldSkipRequest =
    hasTokensValue ||
    tokensAreEqual(fromToken, toToken) ||
    !isPositiveNumber(inputAmount);

  const fetch: UseSwapInput['fetch'] = () => {
    if (!shouldSkipRequest) {
      const requestBody = createBestRouteRequestBody({
        fromToken,
        toToken,
        inputAmount,
        disabledLiquiditySources,
        slippage: userSlippage,
        affiliateRef,
        affiliatePercent,
        affiliateWallets,
      });
      fetchBestRoute(requestBody)
        .then((res) => setRoute(res))
        .catch((error) => {
          resetRoute();
          if (error?.code !== 'ERR_CANCELED') {
            setError(error.message);
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
      return cancelFetch();
    }
    if (shouldSkipRequest) {
      return;
    }
    resetRoute();
    debouncedFetch();
    return cancelFetch;
  }, [inputAmount]);

  return { fetch, loading, error };
}
