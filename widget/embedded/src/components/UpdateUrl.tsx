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
import { useBestRouteStore } from '../store/bestRoute';
import { useUiStore } from '../store/ui';
import { searchParamsToToken } from '../utils/routing';

export function UpdateUrl() {
  const firstRender = useRef(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const firstRenderSearchParams = useRef(location.search);
  const searchParamsRef = useRef<Record<string, string>>({});
  const fromBlockchain = useBestRouteStore.use.fromBlockchain();
  const toBlockchain = useBestRouteStore.use.toBlockchain();
  const fromToken = useBestRouteStore.use.fromToken();
  const toToken = useBestRouteStore.use.toToken();
  const setFromBlockchain = useBestRouteStore.use.setFromBlockchain();
  const setFromToken = useBestRouteStore.use.setFromToken();
  const setToBlockchain = useBestRouteStore.use.setToBlockchain();
  const setToToken = useBestRouteStore.use.setToToken();
  const inputAmount = useBestRouteStore.use.inputAmount();
  const setInputAmount = useBestRouteStore.use.setInputAmount();
  const loadingStatus = useAppStore().use.loadingStatus();
  const blockchains = useAppStore().use.blockchains()();
  const tokens = useAppStore().use.tokens()();
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
      if (loadingStatus !== 'success') {
        fromChainString = searchParamsRef.current[SearchParams.FROM_CHAIN];
        fromTokenString = searchParamsRef.current[SearchParams.FROM_TOKEN];
        toChainString = searchParamsRef.current[SearchParams.TO_CHAIN];
        toTokenString = searchParamsRef.current[SearchParams.TO_TOKEN];
        fromAmount =
          searchParamsRef.current[SearchParams.FROM_AMOUNT] || inputAmount;
      } else {
        if (location.state === 'redirect') {
          return;
        }
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
    if (loadingStatus === 'success') {
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
          setFromToken(fromToken, {
            blockchains: blockchains,
            tokens: tokens,
          });
        }
      }
      if (!!toBlockchain) {
        setToBlockchain(toBlockchain);
        if (!!toToken) {
          setToToken(toToken, { blockchains: blockchains, tokens: tokens });
        }
      }
      if (fromAmount) {
        setInputAmount(fromAmount);
      }
    }
  }, [loadingStatus]);

  return null;
}
