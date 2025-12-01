import type { ConfirmSwapFetchResult } from '../useHandleSwap/useHandleSwap.types';

import { useState } from 'react';

import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import { useHandleSwap } from '../useHandleSwap';

export function useConfirmSwap() {
  const { loading, cancelFetch, fetch: confirmSwap, addSwap } = useHandleSwap();
  const sourceWallet = useAppStore().selectedWallet('source');
  const destinationWallet = useAppStore().selectedWallet('destination');
  const { customDestination, confirmSwapData, setConfirmSwapData } =
    useQuoteStore()();

  const [confirmSwapResult, setConfirmSwapResult] =
    useState<ConfirmSwapFetchResult | null>({
      quoteData: confirmSwapData.quoteData,
      error: null,
      warnings: null,
    });

  const handleConfirmSwap = async () => {
    if (!sourceWallet) {
      return;
    }

    const result = await confirmSwap({
      selectedWallets: [sourceWallet].concat(destinationWallet || []),
      customDestination,
    });

    setConfirmSwapResult(result);

    if (result.warnings?.balance?.messages) {
      return;
    }

    setConfirmSwapData({
      proceedAnyway: false,
      quoteData: result.quoteData,
    });
  };

  const clear = () => setConfirmSwapResult(null);

  return {
    handleConfirmSwap,
    confirmSwapResult,
    loading,
    cancelFetch,
    addSwap,
    clear,
  };
}
