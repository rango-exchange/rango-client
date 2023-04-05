import React from 'react';
import { TokenSelector } from '@rango-dev/ui';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { Token } from 'rango-sdk';
import { numberToString } from '../utils/numbers';
import BigNumber from 'bignumber.js';
import { getBalanceFromWallet } from '../utils/wallets';
import { useWalletsStore } from '../store/wallets';
import { sortedTokens } from '../utils/wallets';
import { ZERO } from '../constants/numbers';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { navigationRoutes } from '../constants/navigationRoutes';

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
  const tokens =
    supportedTokens === 'all'
      ? useMetaStore.use.meta().tokens
      : supportedTokens;
  const fromChain = useBestRouteStore.use.fromChain();
  const toChain = useBestRouteStore.use.toChain();
  const fromToken = useBestRouteStore.use.fromToken();
  const toToken = useBestRouteStore.use.toToken();
  const setFromToken = useBestRouteStore.use.setFromToken();
  const setToToken = useBestRouteStore.use.setToToken();

  const balance = useWalletsStore.use.balances();

  const tokenWithSelectedChain = tokens.filter((token) => {
    if (type === 'from') return token.blockchain === fromChain?.name;
    return token.blockchain === toChain?.name;
  });

  const TokensWithBalance: TokenWithBalance[] = tokenWithSelectedChain.map(
    (token) => {
      const tokenAmount = numberToString(
        new BigNumber(
          getBalanceFromWallet(
            balance,
            token.blockchain,
            token.symbol,
            token.address
          )?.amount || ZERO
        )
      );

      let tokenUsdValue = '';
      if (token.usdPrice)
        tokenUsdValue = numberToString(
          new BigNumber(
            getBalanceFromWallet(
              balance,
              token.blockchain,
              token.symbol,
              token.address
            )?.amount || ZERO
          ).multipliedBy(token.usdPrice)
        );
      return {
        ...token,
        balance: {
          amount: tokenAmount !== '0' ? tokenAmount : '',
          usdValue: tokenUsdValue !== '0' ? tokenUsdValue : '',
        },
      };
    }
  );

  const sortedTokenList = sortedTokens(TokensWithBalance, type, balance);

  return (
    <TokenSelector
      type={type === 'from' ? 'Source' : 'Destination'}
      list={sortedTokenList}
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
