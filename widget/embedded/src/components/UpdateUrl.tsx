import { BlockchainMeta, Token } from 'rango-sdk';
import { useEffect, useRef } from 'react';
import {
  createSearchParams,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { SearchParams } from '../constants/searchParams';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useUiStore } from '../store/ui';
import { searchParamsToToken } from '../utils/routing';

export function UpdateUrl() {
  const firstRender = useRef(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const firstRenderSearchParams = useRef(location.search);
  const searchParamsRef = useRef<Record<string, string>>({});
  const fromChain = useBestRouteStore.use.fromChain();
  const toChain = useBestRouteStore.use.toChain();
  const fromToken = useBestRouteStore.use.fromToken();
  const toToken = useBestRouteStore.use.toToken();
  const setFromChain = useBestRouteStore.use.setFromChain();
  const setFromToken = useBestRouteStore.use.setFromToken();
  const setToChain = useBestRouteStore.use.setToChain();
  const setToToken = useBestRouteStore.use.setToToken();
  const inputAmount = useBestRouteStore.use.inputAmount();
  const setInputAmount = useBestRouteStore.use.setInputAmount();
  const loadingStatus = useMetaStore.use.loadingStatus();
  const { blockchains, tokens } = useMetaStore.use.meta();
  const setSelectedSwap = useUiStore.use.setSelectedSwap();

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
    if (requestId) setSelectedSwap(requestId);
  }, []);

  useEffect(() => {
    let fromChainString = '',
      fromTokenString = '',
      toChainString = '',
      toTokenString = '',
      fromAmount = '';
    if (
      loadingStatus !== 'success' &&
      ![navigationRoutes.confirmWallets, navigationRoutes.confirmSwap].includes(
        location.pathname
      )
    ) {
      fromChainString = searchParamsRef.current[SearchParams.FROM_CHAIN];
      fromTokenString = searchParamsRef.current[SearchParams.FROM_TOKEN];
      toChainString = searchParamsRef.current[SearchParams.TO_CHAIN];
      toTokenString = searchParamsRef.current[SearchParams.TO_TOKEN];
      fromAmount = searchParamsRef.current[SearchParams.FROM_AMOUNT];
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
        fromAmount = searchParamsRef.current[SearchParams.FROM_AMOUNT];
      } else {
        if (location.state === 'redirect') return;
        fromChainString = fromChain?.name || '';
        fromTokenString =
          (fromToken?.symbol || '') +
          (fromToken?.address ? `--${fromToken?.address}` : '');
        toChainString = toChain?.name || '';
        toTokenString =
          (toToken?.symbol || '') +
          (toToken?.address ? `--${toToken?.address}` : '');
        fromAmount = inputAmount;

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
    }
    firstRender.current = false;
  }, [location.pathname, inputAmount]);

  useEffect(() => {
    if (loadingStatus === 'success') {
      const fromChainString = searchParams.get(SearchParams.FROM_CHAIN);
      const fromTokenString = searchParams.get(SearchParams.FROM_TOKEN);
      const toChainString = searchParams.get(SearchParams.TO_CHAIN);
      const toTokenString = searchParams.get(SearchParams.TO_TOKEN);
      const fromAmount = searchParams.get(SearchParams.FROM_AMOUNT);
      const fromChain = blockchains.find(
        (blockchain) => blockchain.name === fromChainString
      );
      const fromToken = searchParamsToToken(tokens, fromTokenString, fromChain);
      const toChain = blockchains.find(
        (blockchain) => blockchain.name === toChainString
      );
      const toToken = searchParamsToToken(tokens, toTokenString, toChain);
      if (!!fromChain) {
        setFromChain(fromChain);
        if (!!fromToken) setFromToken(fromToken);
      }
      if (!!toChain) {
        setToChain(toChain);
        if (!!toToken) setToToken(toToken);
      }
      if (fromAmount) setInputAmount(fromAmount);
    }
  }, [loadingStatus]);

  return null;
}
