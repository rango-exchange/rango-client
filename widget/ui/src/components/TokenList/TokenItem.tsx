import type { TokenWithAmount } from './TokenList';
import type { Token } from 'rango-sdk';
import type { CSSProperties } from 'react';

import React from 'react';

import { styled } from '../../theme';
import { Button } from '../Button';
import { Image } from '../common';
import { Typography } from '../Typography';

const TokenImageContainer = styled('div', {
  paddingRight: '$16',
});

const TokenNameContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

const TokenAmountContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});

interface PropTypes {
  token: TokenWithAmount;
  selected: boolean;
  onClick: (token: Token) => void;
  style?: CSSProperties;
}

export function TokenItem(props: PropTypes) {
  const { token, style, onClick, selected } = props;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        ...style,
        height: '48px',
        top: `${parseFloat(style?.top as string) + 0}px`,
        padding: '0 4px',
      }}>
      <Button
        variant="outlined"
        size="large"
        onClick={onClick.bind(null, token)}
        type={selected ? 'primary' : undefined}
        prefix={
          <TokenImageContainer>
            <Image src={token.image} size={32} />
          </TokenImageContainer>
        }
        suffix={
          token.balance?.amount && (
            <TokenAmountContainer>
              <Typography variant="body" size="small">
                {token.balance.amount}
              </Typography>
              <Typography variant="body" size="xsmall">
                {`${token.balance.usdValue}$`}
              </Typography>
            </TokenAmountContainer>
          )
        }>
        <TokenNameContainer>
          <Typography variant="body" size="medium">
            {token.symbol}
          </Typography>
          <Typography variant="body" size="xsmall" color="neutral800">
            {token.name}
          </Typography>
        </TokenNameContainer>
      </Button>
    </div>
  );
}
