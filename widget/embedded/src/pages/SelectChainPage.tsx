import React from 'react';
import { BlockchainSelector } from '@rango-dev/ui';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { navigationRoutes } from '../constants/navigationRoutes';

interface PropTypes {
  type: 'from' | 'to';
  supportedChains?: string[];
}

export function SelectChainPage(props: PropTypes) {
  const { type, supportedChains } = props;
  const blockchains = supportedChains
    ? useMetaStore.use
        .meta()
        .blockchains.filter(
          (chain) => !supportedChains.includes(chain.name)
        )
    : useMetaStore.use.meta().blockchains;
  const loadingStatus = useMetaStore.use.loadingStatus();
  const fromChain = useBestRouteStore.use.fromChain();
  const toChain = useBestRouteStore.use.toChain();
  const setFromChain = useBestRouteStore.use.setFromChain();
  const setToChain = useBestRouteStore.use.setToChain();

  const { navigateBackFrom } = useNavigateBack();

  return (
    <BlockchainSelector
      type={type === 'from' ? 'Source' : 'Destination'}
      list={blockchains}
      selected={type === 'from' ? fromChain : toChain}
      loadingStatus={loadingStatus}
      onChange={(chain) => {
        if (type === 'from') setFromChain(chain, true);
        else setToChain(chain, true);
        navigateBackFrom(navigationRoutes.fromChain);
      }}
      onBack={navigateBackFrom.bind(null, navigationRoutes.fromChain)}
    />
  );
}
