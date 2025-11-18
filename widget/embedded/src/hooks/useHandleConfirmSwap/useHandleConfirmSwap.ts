import type { ConfirmSwapFetchResult } from '../useConfirmSwap/useConfirmSwap.types';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../../constants/navigationRoutes';
import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import { useConfirmSwap } from '../useConfirmSwap';

export function useHandleConfirmSwap() {
  const {
    loading,
    cancelFetch,
    fetch: confirmSwap,
    addSwap,
  } = useConfirmSwap();
  const sourceWallet = useAppStore().selectedWallet('source');
  const destinationWallet = useAppStore().selectedWallet('destination');
  const { customDestination } = useQuoteStore();
  const navigate = useNavigate();

  const [confirmSwapResult, setConfirmSwapResult] =
    useState<ConfirmSwapFetchResult | null>(null);

  const handleConfirmSwap = async () => {
    if (!sourceWallet) {
      return;
    }

    const result = await confirmSwap({
      selectedWallets: [sourceWallet].concat(destinationWallet || []),
      customDestination,
    });

    setConfirmSwapResult(result);

    if (result.warnings?.balance?.messages.length) {
      return;
    }

    useQuoteStore.setState({
      confirmSwapData: {
        proceedAnyway: false,
        quoteData: result.quoteData,
      },
    });

    navigate('../' + navigationRoutes.confirmSwap, {
      replace: true,
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
