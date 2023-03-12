import { Token } from 'rango-sdk';
import { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { SearchParams } from '../constants/searchParams';

function searchParamsToToken(
  tokens: Token[],
  searchParams: string | null
): Token | null {
  return (
    tokens.find((token) => {
      const symbolAndAddress = searchParams?.split('--');
      if (symbolAndAddress?.length === 1)
        return token.symbol === symbolAndAddress[0] && token.address === null;
      return (
        token.symbol === symbolAndAddress?.[0] &&
        token.address === symbolAndAddress?.[1]
      );
    }) || null
  );
}

export function UpdateUrl() {
  const firstRender = useRef(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

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

  useEffect(() => {
    if (!firstRender.current) {
      if (location.state === 'redirect') return;
      const fromChainString = fromChain?.name || '';
      const fromTokenString =
        (fromToken?.symbol || '') +
        (fromToken?.address ? `--${fromToken?.address}` : '');
      const toChainString = toChain?.name || '';
      const toTokenString =
        (toToken?.symbol || '') +
        (toToken?.address ? `--${toToken?.address}` : '');
      const fromAmount = inputAmount;

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
  }, [location.pathname, inputAmount]);

  useEffect(() => {
    if (loadingStatus === 'success') {
      const fronChainString = searchParams.get(SearchParams.FROM_CHAIN);
      const fromTokenString = searchParams.get(SearchParams.FROM_TOKEN);
      const toChainString = searchParams.get(SearchParams.TO_CHAIN);
      const toTokenString = searchParams.get(SearchParams.TO_TOKEN);
      const fromAmount = searchParams.get(SearchParams.FROM_AMOUNT);
      const fromChain = blockchains.find(
        (blockchain) => blockchain.name === fronChainString
      );
      const fromToken = searchParamsToToken(tokens, fromTokenString);
      const toChain = blockchains.find(
        (blockchain) => blockchain.name === toChainString
      );
      const toToken = searchParamsToToken(tokens, toTokenString);
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
