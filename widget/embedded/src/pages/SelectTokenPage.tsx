import React from 'react';
import { TokenSelector } from '@rangodev/ui';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';
import { Token } from 'rango-sdk';
import { numberToString } from '../utils/numbers';
import BigNumber from 'bignumber.js';
import { getBalanceFromWallet, ZERO } from '../utils/balance';
import { useWalletsStore } from '../store/wallets';

interface PropTypes {
  type: 'from' | 'to';
}

export interface TokenWithBalance extends Token {
  balance?: {
    amount: string;
    usdValue: string;
  };
}

export function SelectTokenPage(props: PropTypes) {
  const { type } = props;
  const navigate = useNavigate();

  const {
    meta: { tokens },
  } = useMetaStore();
  const { fromChain, toChain, fromToken, toToken, setFromToken, setToToken } = useBestRouteStore();
  const balance = useWalletsStore((state) => state.balance);

  const tokenWithSelectedChain = tokens.filter((token) => {
    if (type === 'from') return token.blockchain === fromChain?.name;
    return token.blockchain === toChain?.name;
  });

  const TokensWithBalance: TokenWithBalance[] = tokenWithSelectedChain.map((token) => {
    const tokenAmount = numberToString(
      new BigNumber(
        getBalanceFromWallet(balance, token.blockchain, token.symbol, token.address)?.amount ||
          ZERO,
      ),
    );

    let tokenUsdValue = '';
    if (token.usdPrice)
      tokenUsdValue = numberToString(
        new BigNumber(
          getBalanceFromWallet(balance, token.blockchain, token.symbol, token.address)?.amount ||
            ZERO,
        ).multipliedBy(token.usdPrice),
      );
    return {
      ...token,
      balance: {
        amount: tokenAmount !== '0' ? tokenAmount : '',
        usdValue: tokenUsdValue !== '0' ? tokenUsdValue : '',
      },
    };
  });

  return (
    <TokenSelector
      type={type === 'from' ? 'Source' : 'Destination'}
      list={TokensWithBalance}
      selected={type === 'from' ? fromToken : toToken}
      onChange={(token) => {
        if (type === 'from') setFromToken(token);
        else setToToken(token);
        navigate(-1);
      }}
      onBack={navigate.bind(null, -1)}
    />
  );
}
