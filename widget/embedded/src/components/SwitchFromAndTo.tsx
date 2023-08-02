import React, { useEffect, useRef, useState } from 'react';
import { useInRouterContext, useSearchParams } from 'react-router-dom';
import { styled, Button, VerticalSwapIcon } from '@rango-dev/ui';
import { SearchParams } from '../constants/searchParams';
import { useBestRouteStore } from '../store/bestRoute';

function SwithFromAndTo({ count }: { count: number }) {
  const firstRender = useRef(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const outputAmount = useBestRouteStore.use.outputAmount();

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
        ...(outputAmount && {
          [SearchParams.FROM_AMOUNT]: outputAmount.toString(),
        }),
      });
    } else {
      firstRender.current = false;
    }
  }, [count]);

  return null;
}

const SwitchButtonContainer = styled('div', {
  position: 'absolute',
  bottom: '-12px',
  left: '50%',
  transform: 'translate(-50%, 10%)',
});

export function SwithFromAndToButton() {
  const switchFromAndTo = useBestRouteStore.use.switchFromAndTo();
  const isRouterInContext = useInRouterContext();
  const [count, setCount] = useState(0);

  return (
    <SwitchButtonContainer>
      <Button
        variant="ghost"
        onClick={() => {
          switchFromAndTo();
          setCount((prev) => prev + 1);
        }}>
        <VerticalSwapIcon size={32} />
        {isRouterInContext && <SwithFromAndTo count={count} />}
      </Button>
    </SwitchButtonContainer>
  );
}
