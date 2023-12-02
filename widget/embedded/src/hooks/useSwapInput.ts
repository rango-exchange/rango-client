import type { QuoteError, QuoteWarning } from '../types';
import type { Token } from 'rango-sdk';

import { useCallback, useEffect, useState } from 'react';

import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';
import { useSettingsStore } from '../store/settings';
import { QuoteErrorType } from '../types';
import { debounce } from '../utils/common';
import { isPositiveNumber } from '../utils/numbers';
import { generateQuoteWarnings } from '../utils/quote';
import { createQuoteRequestBody } from '../utils/swap';
import { tokensAreEqual } from '../utils/wallets';

import {
  handleQuoteErrors,
  throwErrorIfResponseIsNotValid,
} from './useConfirmSwap/useConfirmSwap.helpers';
import { useFetchQuote } from './useFetchQuote';

const DEBOUNCE_DELAY = 600;
const FIRST_INDEX = 0;

type FetchQuoteParams = Omit<
  Parameters<typeof createQuoteRequestBody>[typeof FIRST_INDEX],
  'fromToken' | 'toToken'
> & { fromToken: Token | null; toToken: Token | null };

type UseSwapInput = {
  fetch: () => void;
  loading: boolean;
  error: QuoteError | null;
  warning: QuoteWarning | null;
};

/**
 * a hook for fetching quote based on from and to input values
 * we use this hook in home page
 */
export function useSwapInput(): UseSwapInput {
  const { fetch: fetchQuote, cancelFetch } = useFetchQuote();
  const { liquiditySources, enableNewLiquiditySources, experimental } =
    useAppStore().config;
  const tokens = useAppStore().tokens();
  const {
    fromToken,
    toToken,
    inputAmount,
    inputUsdValue,
    resetQuote,
    setQuote,
  } = useQuoteStore();
  const {
    slippage,
    customSlippage,
    affiliatePercent,
    affiliateRef,
    affiliateWallets,
    disabledLiquiditySources,
  } = useSettingsStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<QuoteError | null>(null);
  const [warning, setWarning] = useState<QuoteWarning | null>(null);
  const userSlippage = customSlippage ?? slippage;
  const hasTokensValue = !fromToken || !toToken;
  const shouldSkipRequest =
    hasTokensValue ||
    tokensAreEqual(fromToken, toToken) ||
    !isPositiveNumber(inputAmount);

  const resetState = (loading: boolean) => {
    setLoading(loading);
    setError(null);
    setWarning(null);
  };

  const fetch = (params: FetchQuoteParams) => {
    const {
      fromToken,
      toToken,
      inputAmount,
      liquiditySources,
      excludeLiquiditySources,
      disabledLiquiditySources,
      slippage,
      affiliateRef,
      affiliatePercent,
      affiliateWallets,
    } = params;
    if (!loading) {
      resetState(true);
    }
    if (!shouldSkipRequest && fromToken && toToken) {
      resetQuote();
      const requestBody = createQuoteRequestBody({
        fromToken,
        toToken,
        inputAmount,
        liquiditySources,
        excludeLiquiditySources,
        disabledLiquiditySources,
        slippage,
        affiliateRef,
        affiliatePercent,
        affiliateWallets,
      });
      if (experimental?.routing) {
        requestBody.experimental = true;
      }
      fetchQuote(requestBody)
        .then((res) => {
          setLoading(false);
          setQuote(res);
          throwErrorIfResponseIsNotValid(res);
          const quoteWarning = generateQuoteWarnings(res, {
            fromToken,
            toToken,
            userSlippage,
            tokens,
          });
          setWarning(quoteWarning);
        })
        .catch((error) => {
          const { error: quoteError } = handleQuoteErrors(error);
          if (
            quoteError?.type === QuoteErrorType.NO_RESULT ||
            quoteError?.type === QuoteErrorType.REQUEST_FAILED
          ) {
            resetQuote();
          }
          if (quoteError?.type !== QuoteErrorType.REQUEST_CANCELED) {
            setError(quoteError);
            setLoading(false);
          }
        });
    }
  };

  const debouncedFetch = useCallback(
    debounce((params: FetchQuoteParams) => {
      if (!shouldSkipRequest) {
        fetch(params);
      }
    }, DEBOUNCE_DELAY),
    [shouldSkipRequest]
  );

  useEffect(() => {
    if (!isPositiveNumber(inputAmount) || inputUsdValue?.eq(0)) {
      resetState(false);
      cancelFetch();
      return;
    }
    if (shouldSkipRequest) {
      return;
    }
    resetQuote();
    resetState(true);
    debouncedFetch({
      inputAmount,
      fromToken,
      toToken,
      liquiditySources,
      excludeLiquiditySources: enableNewLiquiditySources,
      disabledLiquiditySources,
      slippage: userSlippage,
      affiliateRef,
      affiliatePercent,
      affiliateWallets,
    });
    return cancelFetch;
  }, [
    inputAmount,
    fromToken?.symbol,
    fromToken?.address,
    fromToken?.blockchain,
    toToken?.symbol,
    toToken?.address,
    toToken?.blockchain,
    shouldSkipRequest,
    liquiditySources?.length,
    enableNewLiquiditySources,
    disabledLiquiditySources.length,
    userSlippage,
    affiliateRef,
    affiliatePercent,
    JSON.stringify(affiliateWallets),
  ]);

  return {
    fetch: () =>
      fetch({
        inputAmount,
        fromToken,
        toToken,
        liquiditySources,
        excludeLiquiditySources: enableNewLiquiditySources,
        disabledLiquiditySources,
        slippage: userSlippage,
        affiliateRef,
        affiliatePercent,
        affiliateWallets,
      }),
    loading,
    error,
    warning,
  };
}
