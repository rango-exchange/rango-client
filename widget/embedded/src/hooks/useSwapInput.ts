import type { QuoteError, QuoteWarning } from '../types';

import { useEffect, useRef, useState } from 'react';

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
  const { liquiditySources, includeNewLiquiditySources } =
    useAppStore().use.config();
  const tokens = useAppStore().use.tokens()();
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
  const prevDisabledLiquiditySources = useRef(disabledLiquiditySources);
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

  const fetch: UseSwapInput['fetch'] = () => {
    if (!loading) {
      resetState(true);
    }
    if (!shouldSkipRequest) {
      resetQuote();
      const requestBody = createQuoteRequestBody({
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

  const debouncedFetch = debounce(() => {
    if (!shouldSkipRequest) {
      fetch();
    }
  }, DEBOUNCE_DELAY);

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

  return { fetch, loading, error, warning };
}
