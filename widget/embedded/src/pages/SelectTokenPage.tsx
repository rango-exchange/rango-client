import React from 'react';
import { TokenSelector } from '@rangodev/ui';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useNavigate } from 'react-router-dom';
import { Token } from 'rango-sdk';
import { numberToString } from '../utils/numbers';
import BigNumber from 'bignumber.js';
import { getBalanceFromWallet } from '../utils/wallets';
import { useWalletsStore } from '../store/wallets';
import { sortedTokens } from '../utils/wallets';

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

  const { tokens } = useMetaStore.use.meta();
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

  const walletSymbols = new Set(
    (balance || [])
      .flatMap((b) => b.accountsWithBalance)
      .flatMap((a) => a.balances || [])
      .filter((b) => (new BigNumber(b?.rawAmount) || ZERO).gt(0))
      .map((b) => `${b?.chain}.${b?.symbol}.${b?.address}`),
  );
  const sortedTokenList = sortedTokens(TokensWithBalance, walletSymbols, type, balance);

  return (
    <TokenSelector
      type={type === 'from' ? 'Source' : 'Destination'}
      list={sortedTokenList}
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
