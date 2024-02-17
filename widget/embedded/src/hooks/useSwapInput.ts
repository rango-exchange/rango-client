import type { Token } from 'rango-sdk';

import { useCallback, useEffect, useState } from 'react';

import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';
import { useWalletsStore } from '../store/wallets';
import { QuoteErrorType } from '../types';
import { debounce } from '../utils/common';
import { isPositiveNumber } from '../utils/numbers';
import {
  generateQuoteWarnings,
  getDefaultQuote,
  sortQuotesBy,
} from '../utils/quote';
import { isFeatureEnabled } from '../utils/settings';
import { createQuoteRequestBody } from '../utils/swap';
import { areTokensEqual } from '../utils/wallets';

import {
  handleQuoteErrors,
  throwErrorIfResponseIsNotValid,
} from './useConfirmSwap/useConfirmSwap.helpers';
import { useFetchAllQuotes } from './useFetchAllQuotes';

const DEBOUNCE_DELAY = 600;
const FIRST_INDEX = 0;

type FetchQuoteParams = Omit<
  Parameters<typeof createQuoteRequestBody>[typeof FIRST_INDEX],
  'fromToken' | 'toToken'
> & { fromToken: Token | null; toToken: Token | null };

type UseSwapInput = {
  fetch: (shouldChangeSelectedQuote?: boolean) => void;
  loading: boolean;
};
type UseSwapInputProps = {
  refetchQuote: boolean;
};
/**
 * a hook for fetching quote based on from and to input values
 * we use this hook in home page
 */
export function useSwapInput({
  refetchQuote,
}: UseSwapInputProps): UseSwapInput {
  const { fetch: fetchQuote, cancelFetch } = useFetchAllQuotes();
  const { enableNewLiquiditySources, features } = useAppStore().config;
  const connectedWallets = useWalletsStore.use.connectedWallets();

  const tokens = useAppStore().tokens();
  const {
    fromToken,
    toToken,
    inputAmount,
    inputUsdValue,
    selectedQuote,
    sortStrategy,
    resetQuote,
    setSelectedQuote,
    updateQuotePartialState,
  } = useQuoteStore();
  const {
    slippage,
    customSlippage,
    affiliatePercent,
    affiliateRef,
    affiliateWallets,
    fetchStatus,
  } = useAppStore();
  const liquiditySources = useAppStore().getLiquiditySources();
  const disabledLiquiditySources = useAppStore().getDisabledLiquiditySources();
  const excludeLiquiditySources = useAppStore().excludeLiquiditySources();

  const [loading, setLoading] = useState(true);
  const userSlippage = customSlippage ?? slippage;
  const tokensValueInvalid = !fromToken || !toToken;
  const shouldSkipRequest =
    tokensValueInvalid ||
    areTokensEqual(fromToken, toToken) ||
    !isPositiveNumber(inputAmount);

  const resetState = (loading: boolean) => {
    setLoading(loading);
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
        liquiditySources: liquiditySources,
        excludeLiquiditySources,
        disabledLiquiditySources,
        wallets: connectedWallets,
        slippage,
        affiliateRef,
        affiliatePercent,
        affiliateWallets,
      });
      if (isFeatureEnabled('experimentalRoute', features)) {
        requestBody.experimental = true;
      }
      fetchQuote(requestBody)
        .then((res) => {
          const sortQuotes = sortQuotesBy(sortStrategy, res.results);
          const quote = getDefaultQuote(
            selectedQuote,
            sortQuotes,
            res.requestAmount
          );

          setLoading(false);
          updateQuotePartialState('quotes', res);
          setSelectedQuote(quote);

          throwErrorIfResponseIsNotValid({
            diagnosisMessages: res.diagnosisMessages,
            requestId: quote?.requestId || '',
            swaps: quote?.swaps,
          });

          const quoteWarning =
            quote &&
            generateQuoteWarnings(quote, {
              fromToken,
              toToken,
              userSlippage,
              tokens,
            });
          updateQuotePartialState('warning', quoteWarning);
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
            updateQuotePartialState('error', quoteError);
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
    if (!refetchQuote) {
      setLoading(false);
      return;
    }
    if (fetchStatus !== 'success') {
      return;
    }
    if (shouldSkipRequest) {
      setLoading(false);
      if (selectedQuote) {
        resetQuote();
      }
      return;
    }
    if (!isPositiveNumber(inputAmount) || inputUsdValue?.eq(0)) {
      resetState(false);
      cancelFetch();
      return;
    }

    resetQuote();
    resetState(true);
    debouncedFetch({
      inputAmount,
      fromToken,
      toToken,
      liquiditySources,
      excludeLiquiditySources,
      disabledLiquiditySources,
      slippage: userSlippage,
      affiliateRef,
      affiliatePercent,
      affiliateWallets,
    });
    return cancelFetch;
  }, [
    fetchStatus,
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
        excludeLiquiditySources,
        disabledLiquiditySources,
        slippage: userSlippage,
        affiliateRef,
        affiliatePercent,
        affiliateWallets,
      }),
    loading,
  };
}
