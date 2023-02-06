import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchParams } from '../constants/searchParams';

export function SwithFromAndTo({ count }: { count: number }) {
  const firstRender = useRef(true);
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(count);

  useEffect(() => {
    if (!firstRender.current) {
      const fromChainString = searchParams.get(SearchParams.FROM_CHAIN);
      const fromTokenString = searchParams.get(SearchParams.FROM_TOKEN);
      const toChainString = searchParams.get(SearchParams.TO_CHAIN);
      const toTokenString = searchParams.get(SearchParams.TO_TOKEN);
      setSearchParams({
        ...(toChainString && { fromChain: toChainString }),
        ...(toTokenString && { fromToken: toTokenString }),
        ...(fromChainString && { toChain: fromChainString }),
        ...(fromTokenString && { toToken: fromTokenString }),
      });
    } else {
      firstRender.current = false;
    }
  }, [count]);

  return null;
}
