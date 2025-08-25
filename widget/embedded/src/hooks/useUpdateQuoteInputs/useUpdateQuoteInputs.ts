import type { UpdateQuoteInputs } from '../../types';

import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';

// This hook provides a function to update quote inputs using fewer and simpler parameters.
export function useUpdateQuoteInputs() {
  const { findToken } = useAppStore();
  const blockchains = useAppStore().blockchains();
  const tokens = useAppStore().tokens();
  const {
    setFromBlockchain,
    setFromToken,
    setToBlockchain,
    setToToken,
    setInputAmount,
  } = useQuoteStore()();

  const updateQuoteInputs: UpdateQuoteInputs = (params) => {
    const { fromBlockchain, fromToken, toBlockchain, toToken, requestAmount } =
      params;
    const meta = { blockchains, tokens };

    if (fromBlockchain !== undefined) {
      const blockchainMeta =
        blockchains.find((blockchain) => blockchain.name === fromBlockchain) ??
        null;
      setFromBlockchain(blockchainMeta);
    }
    if (fromToken !== undefined) {
      const token = fromToken ? findToken(fromToken) ?? null : null;
      setFromToken({ meta, token });
    }
    if (toBlockchain !== undefined) {
      const blockchainMeta =
        blockchains.find((blockchain) => blockchain.name === toBlockchain) ??
        null;
      setToBlockchain(blockchainMeta);
    }
    if (toToken !== undefined) {
      const token = toToken ? findToken(toToken) ?? null : null;
      setToToken({ meta, token });
    }
    if (requestAmount !== undefined) {
      setInputAmount(requestAmount);
    }
  };

  return updateQuoteInputs;
}
