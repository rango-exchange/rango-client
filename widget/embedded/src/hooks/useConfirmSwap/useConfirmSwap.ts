import type { ConfirmSwap, Params } from './useConfirmSwap.types';
import type { PendingSwapSettings } from '../../types';
import type { BestRouteResponse } from 'rango-sdk';

import { calculatePendingSwap } from '@rango-dev/queue-manager-rango-preset';
import { useEffect } from 'react';

import { useMetaStore } from '../../store/meta';
import { useQuoteStore } from '../../store/quote';
import { useSettingsStore } from '../../store/settings';
import { useWalletsStore } from '../../store/wallets';
import { QuoteErrorType } from '../../types';
import { createQuoteRequestBody, getWalletsForNewSwap } from '../../utils/swap';
import { useFetchQuote } from '../useFetchQuote';

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
    setQuote,
    resetQuote,
    quote: initialQuote,
    customDestination: customDestinationFromStore,
    setQuoteWarningsConfirmed,
  } = useQuoteStore();

  const {
    slippage,
    customSlippage,
    affiliatePercent,
    affiliateRef,
    affiliateWallets,
    disabledLiquiditySources,
  } = useSettingsStore();
  const { connectedWallets } = useWalletsStore();

  const { meta } = useMetaStore();

  const userSlippage = customSlippage || slippage;

  const { fetch: fetchQuote, cancelFetch, loading } = useFetchQuote();

  useEffect(() => cancelFetch, []);

  const fetch: ConfirmSwap['fetch'] = async (params: Params) => {
    const selectedWallets = params.selectedWallets;
    const customDestination =
      params?.customDestination ?? customDestinationFromStore;

    if (!fromToken || !toToken || !inputAmount || !initialQuote) {
      return {
        quote: null,
        swap: null,
        error: null,
        warnings: null,
      };
    }

    const requestBody = createQuoteRequestBody({
      fromToken,
      toToken,
      inputAmount,
      wallets: connectedWallets,
      selectedWallets,
      disabledLiquiditySources,
      slippage: userSlippage,
      affiliateRef,
      affiliatePercent,
      affiliateWallets,
      initialQuote: initialQuote,
      destination: customDestination,
    });

    let currentQuote: BestRouteResponse;
    try {
      currentQuote = await fetchQuote(requestBody).then((response) =>
        throwErrorIfResponseIsNotValid(response)
      );
      setQuote(currentQuote);
    } catch (error: any) {
      const confirmSwapResult = handleQuoteErrors(error);
      if (
        confirmSwapResult.error?.type === QuoteErrorType.NO_RESULT ||
        confirmSwapResult.error?.type === QuoteErrorType.REQUEST_FAILED
      ) {
        resetQuote();
      }
      return confirmSwapResult;
    }

    const swapSettings: PendingSwapSettings = {
      slippage: userSlippage.toString(),
      disabledSwappersGroups: disabledLiquiditySources,
    };
    const swap = calculatePendingSwap(
      inputAmount.toString(),
      currentQuote,
      getWalletsForNewSwap(selectedWallets),
      swapSettings,
      false,
      meta
    );

    const confirmSwapWarnings = generateWarnings(initialQuote, currentQuote, {
      fromToken,
      toToken,
      tokens: meta.tokens,
      selectedWallets,
      userSlippage,
    });

    if (confirmSwapWarnings.quoteUpdate) {
      setQuoteWarningsConfirmed(false);
    }

    return {
      quote: currentQuote,
      swap,
      error: null,
      warnings: confirmSwapWarnings,
    };
  };

  return {
    loading,
    fetch,
    cancelFetch,
  };
}
