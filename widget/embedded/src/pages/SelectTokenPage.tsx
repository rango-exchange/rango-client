import React from 'react';
import { TokenSelector } from '@rango-dev/ui';
import { useBestRouteStore } from '../store/bestRoute';
import { Asset, Token } from 'rango-sdk';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { navigationRoutes } from '../constants/navigationRoutes';
import { tokensAreEqual } from '../utils/wallets';
import { useMetaStore } from '../store/meta';

interface PropTypes {
  type: 'from' | 'to';
  supportedTokens?: Asset[];
}

export interface TokenWithBalance extends Token {
  balance?: {
    amount: string;
    usdValue: string;
  };
}

export function SelectTokenPage(props: PropTypes) {
  const { navigateBackFrom } = useNavigateBack();

  const { type, supportedTokens } = props;
  const sourceTokens = useBestRouteStore.use.sourceTokens();
  const destinationTokens = useBestRouteStore.use.destinationTokens();
  const supportedSourceTokens = supportedTokens
    ? sourceTokens.filter((token) =>
        supportedTokens.some((supportedToken) =>
          tokensAreEqual(supportedToken, token)
        )
      )
    : sourceTokens;

  const supportedDestinationTokens = supportedTokens
    ? destinationTokens.filter((token) =>
        supportedTokens.some((supportedToken) =>
          tokensAreEqual(supportedToken, token)
        )
      )
    : destinationTokens;

  const fromToken = useBestRouteStore.use.fromToken();
  const toToken = useBestRouteStore.use.toToken();
  const setFromToken = useBestRouteStore.use.setFromToken();
  const setToToken = useBestRouteStore.use.setToToken();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();

  return (
    <TokenSelector
      type={type === 'from' ? 'Source' : 'Destination'}
      list={type == 'from' ? supportedSourceTokens : supportedDestinationTokens}
      selected={type === 'from' ? fromToken : toToken}
      onChange={(token) => {
        if (type === 'from') setFromToken(token);
        else setToToken(token);
        navigateBackFrom(navigationRoutes.fromToken);
      }}
      onBack={navigateBackFrom.bind(null, navigationRoutes.fromToken)}
      loadingStatus={loadingMetaStatus}
    />
  );
}
