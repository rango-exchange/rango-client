import React from 'react';
import { BlockchainSelector } from '@rango-dev/ui';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { navigationRoutes } from '../constants/navigationRoutes';
import { BlockchainMeta } from 'rango-sdk';

interface PropTypes {
  type: 'from' | 'to';
  supportedChains: 'all' | BlockchainMeta[];
}

export function SelectChainPage(props: PropTypes) {
  const { type, supportedChains } = props;
  const blockchains =
    supportedChains === 'all'
      ? useMetaStore.use.meta().blockchains
      : supportedChains;
  const loadingStatus = useMetaStore.use.loadingStatus();
  const fromChain = useBestRouteStore.use.fromChain();
  const toChain = useBestRouteStore.use.toChain();
  const setFromChain = useBestRouteStore.use.setFromChain();
  const setToChain = useBestRouteStore.use.setToChain();
  const setFromToken = useBestRouteStore.use.setFromToken();
  const setToToken = useBestRouteStore.use.setToToken();

  const { navigateBackFrom } = useNavigateBack();

  return (
    <BlockchainSelector
      type={type === 'from' ? 'Source' : 'Destination'}
      list={blockchains}
      selected={type === 'from' ? fromChain : toChain}
      loadingStatus={loadingStatus}
      onChange={(chain) => {
        if (type === 'from') setFromChain(chain);
        else setToChain(chain);
        if (type === 'from' && fromChain?.name != chain.name)
          setFromToken(null);
        if (type === 'to' && toChain?.name != chain.name) setToToken(null);
        navigateBackFrom(navigationRoutes.fromChain);
      }}
      onBack={navigateBackFrom.bind(null, navigationRoutes.fromChain)}
    />
  );
}
