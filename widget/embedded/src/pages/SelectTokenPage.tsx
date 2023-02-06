import React from 'react';
import { TokenSelector } from '@rangodev/ui';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';

interface PropTypes {
  type: 'from' | 'to';
}

export function SelectTokenPage(props: PropTypes) {
  const { type } = props;
  const navigate = useNavigate();

  const {
    meta: { tokens },
  } = useMetaStore();
  const { fromChain, toChain, fromToken, toToken, setFromToken, setToToken } = useBestRouteStore();

  return (
    <TokenSelector
      type={type === 'from' ? 'Source' : 'Destination'}
      list={tokens.filter((token) => {
        if (type === 'from') return token.blockchain === fromChain?.name;
        return token.blockchain === toChain?.name;
      })}
      selected={type === 'from' ? fromToken : toToken}
      onChange={(token) => {
        if (type === 'from') setFromToken(token);
        else setToToken(token);
        navigate(navigationRoutes.home);
      }}
      onBack={navigate.bind(null, navigationRoutes.home)}
    />
  );
}
