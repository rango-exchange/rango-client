import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchParams } from '../constants/searchParams';
import { useBestRouteStore } from '../store/bestRoute';

export function SwithFromAndTo({ count }: { count: number }) {
  const firstRender = useRef(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { outputAmount } = useBestRouteStore();

  useEffect(() => {
    if (!firstRender.current) {
      const fromChainString = searchParams.get(SearchParams.FROM_CHAIN);
      const fromTokenString = searchParams.get(SearchParams.FROM_TOKEN);
      const toChainString = searchParams.get(SearchParams.TO_CHAIN);
      const toTokenString = searchParams.get(SearchParams.TO_TOKEN);
      setSearchParams({
        ...(toChainString && { [SearchParams.FROM_CHAIN]: toChainString }),
        ...(toTokenString && { [SearchParams.FROM_TOKEN]: toTokenString }),
        ...(fromChainString && { [SearchParams.TO_CHAIN]: fromChainString }),
        ...(fromTokenString && { [SearchParams.TO_TOKEN]: fromTokenString }),
        ...(outputAmount && { [SearchParams.FROM_AMOUNT]: outputAmount.toString() }),
      });
    } else {
      firstRender.current = false;
    }
  }, [count]);

  return null;
}
