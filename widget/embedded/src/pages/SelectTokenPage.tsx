import React from 'react';
import { TokenSelector } from '@rango-dev/ui';
import { useBestRouteStore } from '../store/bestRoute';
import { Token } from 'rango-sdk';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { navigationRoutes } from '../constants/navigationRoutes';
import { tokensAreEqual } from '../utils/wallets';

interface PropTypes {
  type: 'from' | 'to';
  supportedTokens: 'all' | Token[];
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
  const supportedSourceTokens =
    supportedTokens === 'all'
      ? sourceTokens
      : sourceTokens.filter((token) =>
          supportedTokens.some((supportedToken) =>
            tokensAreEqual(supportedToken, token)
          )
        );

  const supportedDestinationTokens =
    supportedTokens === 'all'
      ? destinationTokens
      : destinationTokens.filter((token) =>
          supportedTokens.some((supportedToken) =>
            tokensAreEqual(supportedToken, token)
          )
        );

  const fromToken = useBestRouteStore.use.fromToken();
  const toToken = useBestRouteStore.use.toToken();
  const setFromToken = useBestRouteStore.use.setFromToken();
  const setToToken = useBestRouteStore.use.setToToken();

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
    />
  );
}
