import React from 'react';
import { BlockchainSelector } from '@rangodev/ui';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../router/navigationRoutes';

interface PropTypes {
  type: 'from' | 'to';
}

export function SelectChainPage(props: PropTypes) {
  const { type } = props;

  const {
    meta: { blockchains },
  } = useMetaStore();
  const { fromChain, toChain, setFromChain, setToChain, setFromToken, setToToken } =
    useBestRouteStore();
  const navigate = useNavigate();

  return (
    <BlockchainSelector
      type={type === 'from' ? 'Source' : 'Destination'}
      list={blockchains}
      selected={type === 'from' ? fromChain : toChain}
      onChange={(chain) => {
        if (type === 'from') setFromChain(chain);
        else setToChain(chain);
        if (type === 'from' && fromChain?.name != chain.name) setFromToken(null);
        if (type === 'to' && toChain?.name != chain.name) setToToken(null);
        navigate(navigationRoutes.home);
      }}
      onBack={navigate.bind(null, navigationRoutes.home)}
    />
  );
}
