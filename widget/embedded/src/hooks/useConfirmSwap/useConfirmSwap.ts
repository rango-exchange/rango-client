import type { ConfirmSwap } from './useConfirmSwap.types';
import type { PendingSwapSettings, SelectedQuote } from '../../types';
import type { ConfirmRouteRequest } from 'rango-sdk';

import { calculatePendingSwap } from '@rango-dev/queue-manager-rango-preset';
import { useEffect } from 'react';

import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import { getWalletsForNewSwap } from '../../utils/swap';
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
  const disabledLiquiditySources = useAppStore().getDisabledLiquiditySources();
  const blockchains = useAppStore().blockchains();
  const tokens = useAppStore().tokens();
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
        swap: null,
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
        const swapSettings: PendingSwapSettings = {
          slippage: userSlippage.toString(),
          disabledSwappersGroups: disabledLiquiditySources,
        };

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

        const proceedAnyway = !!confirmSwapWarnings.balance;

        const swap = calculatePendingSwap(
          inputAmount.toString(),
          result,
          getWalletsForNewSwap(selectedWallets),
          swapSettings,
          proceedAnyway ? false : true,
          { blockchains, tokens }
        );

        return {
          quote: currentQuote,
          swap,
          error: null,
          warnings: confirmSwapWarnings,
        };
      });
    } catch (error: any) {
      const confirmSwapResult = handleQuoteErrors(error);
      return confirmSwapResult;
    }
  };

  return {
    loading,
    fetch,
    cancelFetch,
  };
}
