import { Token } from 'rango-sdk';
import React, { CSSProperties } from 'react';
import { styled } from '../../theme';
import { Button } from '../Button';
import { Typography } from '../Typography';
import { TokenWithAmount } from './TokenList';

const TokenImage = styled('img', {
  width: '$32',
  maxHeight: '$32',
  marginRight: '$16',
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
      }}
    >
      <Button
        variant="outlined"
        size="large"
        align="start"
        onClick={onClick.bind(null, token)}
        type={selected ? 'primary' : undefined}
        prefix={<TokenImage src={token.image} />}
        suffix={
          token.balance?.amount && (
            <TokenAmountContainer>
              <Typography variant="body2">{token.balance.amount}</Typography>
              <Typography variant="caption">
                {`${token.balance.usdValue}$`}
              </Typography>
            </TokenAmountContainer>
          )
        }
      >
        <TokenNameContainer>
          <Typography variant="body1">{token.symbol}</Typography>
          <Typography variant="caption" color="neutrals600">
            {token.name}
          </Typography>
        </TokenNameContainer>
      </Button>
    </div>
  );
}
