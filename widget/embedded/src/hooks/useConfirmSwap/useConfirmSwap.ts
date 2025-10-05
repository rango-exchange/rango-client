import type { ConfirmSwap } from './useConfirmSwap.types';
import type { ConfirmRouteRequest } from 'rango-sdk';

import { warn } from '@rango-dev/logging-core';
import { useEffect } from 'react';

import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import { QuoteErrorType, type SelectedQuote } from '../../types';
import { useFetchConfirmQuote } from '../useFetchConfirmQuote';

import {
  generateWarnings,
  handleQuoteErrors,
  throwErrorIfResponseIsNotValid,
} from './useConfirmSwap.helpers';

export function useConfirmSwap(): ConfirmSwap {
  const {
    fromToken,
    toToken,
    inputAmount,
    inputUsdValue,
    setSelectedQuote,
    selectedQuote: initialQuote,
    customDestination: customDestinationFromStore,
    resetAlerts,
  } = useQuoteStore();

  const { slippage, customSlippage } = useAppStore();
  const blockchains = useAppStore().blockchains();
  const { findToken } = useAppStore();

  const userSlippage = customSlippage || slippage;

  const { fetch: fetchQuote, cancelFetch, loading } = useFetchConfirmQuote();

  useEffect(() => cancelFetch, []);

  const fetch: ConfirmSwap['fetch'] = async (params) => {
    const selectedWallets = params.selectedWallets;
    const customDestination =
      params?.customDestination ?? customDestinationFromStore;

    if (!fromToken || !toToken || !inputAmount) {
      return {
        quote: null,
        response: null,
        error: null,
        warnings: null,
      };
    }

    const wallets = selectedWallets.reduce(
      (acc: Record<string, string>, item) => {
        acc[item.chain] = item.address;
        return acc;
      },
      {}
    );
    const requestBody: ConfirmRouteRequest = {
      requestId: initialQuote?.requestId || '',
      selectedWallets: wallets,
      destination: customDestination || undefined,
    };

    try {
      return await fetchQuote(requestBody, true).then((response) => {
        const { result } = response;

        if (!result) {
          throw new Error(response.error ?? 'Error fetching updated quote');
        }

        throwErrorIfResponseIsNotValid({
          diagnosisMessages: result.diagnosisMessages,
          requestId: result.requestId,
          swaps: result.result?.swaps,
        });

        const currentQuote: SelectedQuote = {
          outputAmount: result.result?.outputAmount,
          requestId: result.requestId,
          resultType: result.result?.resultType,
          swaps: result.result?.swaps || [],
          validationStatus: result.validationStatus,
          requestAmount: result.requestAmount,
        };
        setSelectedQuote(currentQuote);

        const confirmSwapWarnings = generateWarnings({
          previousQuote: initialQuote ?? undefined,
          currentQuote,
          meta: { blockchains },
          selectedWallets,
          userSlippage,
          inputUsdValue,
          findToken,
        });

        resetAlerts();

        return {
          quote: currentQuote,
          response: response.result,
          error: null,
          warnings: confirmSwapWarnings,
        };
      });
    } catch (error: unknown) {
      const quoteError = handleQuoteErrors(error);
      if (quoteError.type !== QuoteErrorType.REQUEST_CANCELED) {
        warn(new Error('confirm swap error'), {
          tags: {
            ...quoteError,
            type: QuoteErrorType[quoteError.type],
            initialQuote,
            requestBody,
          },
        });
      }
      return { response: null, error: quoteError, warnings: null };
    }
  };

  return {
    loading,
    fetch,
    cancelFetch,
  };
}
