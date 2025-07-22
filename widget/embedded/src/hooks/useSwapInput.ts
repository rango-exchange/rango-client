import type { Token } from 'rango-sdk';

import { warn } from '@arlert-dev/logging-core';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';
import { QuoteErrorType } from '../types';
import { debounce } from '../utils/common';
import { isPositiveNumber } from '../utils/numbers';
import {
  generateQuoteWarnings,
  getDefaultQuote,
  sortQuotesBy,
} from '../utils/quote';
import { isRoutingEnabled } from '../utils/settings';
import { createQuoteRequestBody } from '../utils/swap';
import { areTokensEqual } from '../utils/wallets';

import {
  handleQuoteErrors,
  throwErrorIfResponseIsNotValid,
} from './useConfirmSwap/useConfirmSwap.helpers';
import { useFetchAllQuotes } from './useFetchAllQuotes';

const DEBOUNCE_DELAY = 600;

type FetchQuoteParams = Omit<
  Parameters<typeof createQuoteRequestBody>[0],
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
  const { excludeLiquiditySources: configExcludeLiquiditySources, routing } =
    useAppStore().config;
  const { connectedWallets } = useAppStore();
  const anyContractWalletConnected = connectedWallets.some(
    (wallet) => wallet.isContractWallet
  );
  const contractCall = anyContractWalletConnected;

  const {
    fromToken,
    toToken,
    inputAmount,
    inputUsdValue,
    selectedQuote,
    sortStrategy,
    resetQuote,
    error,
    warning,
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
  const { findToken } = useAppStore();

  const [loading, setLoading] = useState(true);
  const prevInputAmount = useRef(inputAmount);
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
        contractCall,
      });
      if (isRoutingEnabled('experimental', routing)) {
        requestBody.experimental = true;
      }

      if (isRoutingEnabled('avoidNativeFee', routing)) {
        requestBody.avoidNativeFee = true;
      }

      if (isRoutingEnabled('enableCentralizedSwappers', routing)) {
        requestBody.enableCentralizedSwappers = true;
      }

      if (routing?.maxLength) {
        requestBody.maxLength = routing.maxLength;
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
            generateQuoteWarnings({
              currentQuote: quote,
              userSlippage,
              findToken,
            });
          updateQuotePartialState('warning', quoteWarning);
        })
        .catch((error) => {
          const quoteError = handleQuoteErrors(error);
          if (
            quoteError.type === QuoteErrorType.NO_RESULT ||
            quoteError.type === QuoteErrorType.REQUEST_FAILED
          ) {
            resetQuote();
          }

          if (quoteError.type !== QuoteErrorType.REQUEST_CANCELED) {
            updateQuotePartialState('error', quoteError);
            setLoading(false);
            warn(new Error('quote error'), {
              tags: {
                ...quoteError,
                type: QuoteErrorType[quoteError.type],
                requestBody,
              },
            });
          }
        });
    }
  };

  const debouncedFetch = useCallback(
    debounce((params: FetchQuoteParams) => {
      fetch(params);
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
      if (selectedQuote || error || warning) {
        resetQuote();
      }
      return;
    }
    if (!isPositiveNumber(inputAmount) && inputUsdValue?.eq(0)) {
      resetState(false);
      cancelFetch();
      return;
    }

    resetQuote();
    resetState(true);

    let fetchQuotes = fetch;
    if (prevInputAmount.current && prevInputAmount.current != inputAmount) {
      fetchQuotes = debouncedFetch;
    }
    prevInputAmount.current = inputAmount;

    fetchQuotes({
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
      contractCall,
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
    configExcludeLiquiditySources,
    disabledLiquiditySources.length,
    userSlippage,
    affiliateRef,
    affiliatePercent,
    contractCall,
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
        contractCall,
      }),
    loading,
  };
}
