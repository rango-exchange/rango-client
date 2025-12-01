import type { ConfirmSwap } from './useHandleSwap.types';
import type { PendingSwapSettings, SelectedQuote } from '../../types';
import type { ConfirmRouteRequest, ConfirmRouteResponse } from 'rango-sdk';

import { warn } from '@rango-dev/logging-core';
import { calculatePendingSwap } from '@rango-dev/queue-manager-rango-preset';
import { useManager } from '@rango-dev/queue-manager-react';
import { useEffect } from 'react';

import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import { QuoteErrorType } from '../../types';
import { getWalletsForNewSwap } from '../../utils/swap';
import { useFetchConfirmQuote } from '../useFetchConfirmQuote';

import {
  generateWarnings,
  handleQuoteErrors,
  throwErrorIfResponseIsNotValid,
} from './useHandleSwap.helpers';

export function useHandleSwap(): ConfirmSwap {
  const {
    fromToken,
    toToken,
    inputAmount,
    inputUsdValue,
    setSelectedQuote,
    selectedQuote: initialQuote,
    customDestination: customDestinationFromStore,
    confirmSwapData,
    resetAlerts,
  } = useQuoteStore();
  const { manager } = useManager();

  const { slippage, customSlippage, disabledLiquiditySources } = useAppStore();
  const blockchains = useAppStore().blockchains();
  const tokens = useAppStore().tokens();
  const { findToken } = useAppStore();
  const sourceWallet = useAppStore().selectedWallet('source');
  const destinationWallet = useAppStore().selectedWallet('destination');
  const selectedWalletsForConfirmation = sourceWallet
    ? [sourceWallet].concat(destinationWallet ?? [])
    : [];

  const userSlippage = customSlippage || slippage;

  const { fetch: fetchQuote, cancelFetch, loading } = useFetchConfirmQuote();

  useEffect(() => cancelFetch, []);

  const fetch: ConfirmSwap['fetch'] = async (params) => {
    const selectedWallets = params.selectedWallets;
    const customDestination =
      params?.customDestination ?? customDestinationFromStore;

    if (!fromToken || !toToken || !inputAmount) {
      return {
        quoteData: null,
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
      return await fetchQuote(requestBody, true).then((fetchQuoteResponse) => {
        const { result } = fetchQuoteResponse;

        if (!result) {
          throw new Error(
            fetchQuoteResponse.error ?? 'Error fetching updated quote'
          );
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
          selectedWallets,
          userSlippage,
          inputUsdValue,
          findToken,
        });

        resetAlerts();

        return {
          quoteData: result,
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
      return { quoteData: null, error: quoteError, warnings: null };
    }
  };

  const addSwap = async (quoteData?: ConfirmRouteResponse['result']) => {
    const data = quoteData || confirmSwapData.quoteData;
    if (data) {
      const userSlippage = customSlippage || slippage;
      const swapSettings: PendingSwapSettings = {
        slippage: userSlippage.toString(),
        disabledSwappersGroups: disabledLiquiditySources,
      };

      const swap = calculatePendingSwap(
        inputAmount.toString(),
        data,
        getWalletsForNewSwap(selectedWalletsForConfirmation ?? []),
        swapSettings,
        confirmSwapData.proceedAnyway,
        { blockchains, tokens }
      );
      await manager?.create(
        'swap',
        { swapDetails: swap },
        { id: swap.requestId }
      );
    }
  };

  return {
    loading,
    fetch,
    addSwap,
    cancelFetch,
  };
}
