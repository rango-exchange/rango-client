import { useEffect } from 'react';

import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';

/**
 * Currently, the quote store is not part of the app store,
 * so it can't directly access the wallets slice.
 * To update the selected wallets,
 * we would need to pass the relevant methods from the app store into the setFromToken and setToToken functions,
 * which would introduce significant changes.
 * For now, a cleaner approach is to listen for changes in fromToken and toToken,
 * and trigger the wallet update method accordingly.
 */
export function useUpdateSelectedWallets() {
  const { fromToken, toToken, setCustomDestination } = useQuoteStore()();
  const {
    clearSelectedWallet,
    tryMatchWalletForBlockchain,
    isSelectedWalletStillRelevant,
  } = useAppStore();

  useEffect(() => {
    const shouldUpdateSourceWallet = !isSelectedWalletStillRelevant('source');
    if (shouldUpdateSourceWallet) {
      clearSelectedWallet('source');
      if (fromToken) {
        tryMatchWalletForBlockchain('source', fromToken.blockchain);
      }
    }
  }, [fromToken?.blockchain, fromToken?.address, fromToken?.symbol]);

  useEffect(() => {
    setCustomDestination(null);

    const shouldUpdateDestinationWallet =
      !isSelectedWalletStillRelevant('destination');
    if (shouldUpdateDestinationWallet) {
      clearSelectedWallet('destination');
      if (toToken) {
        tryMatchWalletForBlockchain('destination', toToken.blockchain);
      }
    }
  }, [toToken?.blockchain, toToken?.address, toToken?.symbol]);
}
