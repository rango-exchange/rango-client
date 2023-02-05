import { Token } from 'rango-sdk';
import { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { SearchParams } from './searchParams';

function searchParamsToToken(tokens: Token[], searchParams: string | null): Token | null {
  return (
    tokens.find((token) => {
      const symbolAndAddress = searchParams?.split('--');
      return token.symbol === symbolAndAddress?.[0] && token.address === symbolAndAddress?.[1];
    }) || null
  );
}

export function UpdateUrl() {
  const firstRender = useRef(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const {
    fromChain,
    toChain,
    fromToken,
    toToken,
    setFromChain,
    setFromToken,
    setToChain,
    setToToken,
  } = useBestRouteStore();

  const {
    loadingStatus,
    meta: { blockchains, tokens },
  } = useMetaStore();

  useEffect(() => {
    if (!firstRender.current) {
      const fromChainString = fromChain?.name || '';
      const fromTokenString =
        (fromToken?.symbol || '') + (fromToken?.address ? `--${fromToken?.address}` : '');
      const toChainString = toChain?.name || '';
      const toTokenString =
        (toToken?.symbol || '') + (toToken?.address ? `--${toToken?.address}` : '');
      setSearchParams({
        ...(fromChainString && { [SearchParams.FROM_CHAIN]: fromChainString }),
        ...(fromTokenString && { [SearchParams.FROM_TOKEN]: fromTokenString }),
        ...(toChainString && { [SearchParams.TO_CHAIN]: toChainString }),
        ...(toTokenString && { [SearchParams.TO_TOKEN]: toTokenString }),
      });
    }
    firstRender.current = false;
  }, [location.pathname]);

  useEffect(() => {
    if (loadingStatus === 'success') {
      const fronChainString = searchParams.get(SearchParams.FROM_CHAIN);
      const fromTokenString = searchParams.get(SearchParams.FROM_TOKEN);
      const toChainString = searchParams.get(SearchParams.TO_CHAIN);
      const toTokenString = searchParams.get(SearchParams.TO_TOKEN);
      const fromChain = blockchains.find((blockchain) => blockchain.name === fronChainString);
      const fromToken = searchParamsToToken(tokens, fromTokenString);
      const toChain = blockchains.find((blockchain) => blockchain.name === toChainString);
      const toToken = searchParamsToToken(tokens, toTokenString);
      if (!!fromChain) {
        setFromChain(fromChain);
        if (!!fromToken) setFromToken(fromToken);
      }
      if (!!toChain) {
        setToChain(toChain);
        if (!!toToken) setToToken(toToken);
      }
    }
  }, [loadingStatus]);

  return null;
}
