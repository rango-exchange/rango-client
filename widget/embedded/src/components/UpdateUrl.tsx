import { useEffect, useRef } from 'react';
import {
  createSearchParams,
  useLocation,
  useSearchParams,
} from 'react-router-dom';

import { navigationRoutes } from '../constants/navigationRoutes';
import { SearchParams } from '../constants/searchParams';
import { useSyncStoresWithConfig } from '../hooks/useSyncStoresWithConfig';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';
import { useUiStore } from '../store/ui';
import { searchParamsToToken } from '../utils/quote';

export function UpdateUrl() {
  const firstRender = useRef(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const firstRenderSearchParams = useRef(location.search);
  const searchParamsRef = useRef<Record<string, string>>({});
  const fromBlockchain = useQuoteStore.use.fromBlockchain();
  const toBlockchain = useQuoteStore.use.toBlockchain();
  const fromToken = useQuoteStore.use.fromToken();
  const toToken = useQuoteStore.use.toToken();
  const setFromBlockchain = useQuoteStore.use.setFromBlockchain();
  const setFromToken = useQuoteStore.use.setFromToken();
  const setToBlockchain = useQuoteStore.use.setToBlockchain();
  const setToToken = useQuoteStore.use.setToToken();
  const inputAmount = useQuoteStore.use.inputAmount();
  const setInputAmount = useQuoteStore.use.setInputAmount();
  const fetchMetaStatus = useAppStore().fetchStatus;
  const blockchains = useAppStore().blockchains();
  const tokens = useAppStore().tokens();
  const setSelectedSwap = useUiStore.use.setSelectedSwap();
  useSyncStoresWithConfig();

  useEffect(() => {
    const params: Record<string, string> = {};
    createSearchParams(firstRenderSearchParams.current).forEach(
      (value, key) => {
        params[key] = value;
      }
    );
    searchParamsRef.current = params;
    const requestId =
      location.pathname.split(navigationRoutes.swaps + '/')[1] || null;
    if (requestId) {
      setSelectedSwap(requestId);
    }
  }, []);

  useEffect(() => {
    if (!firstRender.current) {
      let fromChainString = '',
        fromTokenString = '',
        toChainString = '',
        toTokenString = '',
        fromAmount = '';
      const autoConnect = searchParamsRef.current[SearchParams.AUTO_CONNECT];
      if (fetchMetaStatus !== 'success') {
        fromChainString = searchParamsRef.current[SearchParams.FROM_CHAIN];
        fromTokenString = searchParamsRef.current[SearchParams.FROM_TOKEN];
        toChainString = searchParamsRef.current[SearchParams.TO_CHAIN];
        toTokenString = searchParamsRef.current[SearchParams.TO_TOKEN];
        fromAmount =
          searchParamsRef.current[SearchParams.FROM_AMOUNT] || inputAmount;
      } else {
        fromChainString = fromBlockchain?.name || '';
        fromTokenString =
          (fromToken?.symbol || '') +
          (fromToken?.address ? `--${fromToken?.address}` : '');
        toChainString = toBlockchain?.name || '';
        toTokenString =
          (toToken?.symbol || '') +
          (toToken?.address ? `--${toToken?.address}` : '');
        fromAmount = inputAmount;
      }
      setSearchParams(
        {
          ...(fromChainString && {
            [SearchParams.FROM_CHAIN]: fromChainString,
          }),
          ...(fromTokenString && {
            [SearchParams.FROM_TOKEN]: fromTokenString,
          }),
          ...(toChainString && { [SearchParams.TO_CHAIN]: toChainString }),
          ...(toTokenString && { [SearchParams.TO_TOKEN]: toTokenString }),
          ...(fromAmount && {
            [SearchParams.FROM_AMOUNT]: fromAmount.toString(),
          }),
          ...(autoConnect && {
            [SearchParams.AUTO_CONNECT]: autoConnect,
          }),
        },
        { replace: true }
      );
    }
    firstRender.current = false;
  }, [
    location.pathname,
    inputAmount,
    fromBlockchain,
    fromToken,
    toBlockchain,
    toToken,
  ]);

  useEffect(() => {
    if (fetchMetaStatus === 'success') {
      const fromChainString = searchParams.get(SearchParams.FROM_CHAIN);
      const fromTokenString = searchParams.get(SearchParams.FROM_TOKEN);
      const toChainString = searchParams.get(SearchParams.TO_CHAIN);
      const toTokenString = searchParams.get(SearchParams.TO_TOKEN);
      const fromAmount = searchParams.get(SearchParams.FROM_AMOUNT);
      const fromBlockchain = blockchains.find(
        (blockchain) => blockchain.name === fromChainString
      );
      const fromToken = searchParamsToToken(
        tokens,
        fromTokenString,
        fromBlockchain || null
      );
      const toBlockchain = blockchains.find(
        (blockchain) => blockchain.name === toChainString
      );
      const toToken = searchParamsToToken(
        tokens,
        toTokenString,
        toBlockchain || null
      );
      if (!!fromBlockchain) {
        setFromBlockchain(fromBlockchain);
        if (!!fromToken) {
          setFromToken({
            token: fromToken,
            meta: {
              blockchains: blockchains,
              tokens: tokens,
            },
          });
        }
      }
      if (!!toBlockchain) {
        setToBlockchain(toBlockchain);
        if (!!toToken) {
          setToToken({
            token: toToken,
            meta: { blockchains: blockchains, tokens: tokens },
          });
        }
      }
      if (fromAmount) {
        setInputAmount(fromAmount);
      }
    }
  }, [fetchMetaStatus]);

  return null;
}
