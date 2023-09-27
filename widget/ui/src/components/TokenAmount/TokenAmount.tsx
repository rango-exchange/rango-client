import type { PropTypes } from './TokenAmount.types';

import React from 'react';

import { ChainToken } from '../ChainToken';
import { PriceImpact } from '../PriceImpact/PriceImpact';
import { Typography } from '../Typography';

import { Container } from './TokenAmount.styles';

export function TokenAmount(props: PropTypes) {
  return (
    <Container direction={props.direction} centerAlign={props.centerAlign}>
      <div className="token-amount">
        <ChainToken
          chainImage={props.chain.image}
          tokenImage={props.token.image}
          size="medium"
        />
        <Typography ml={4} size="xsmall" variant="headline">
          {props.price.value}
        </Typography>
        <Typography
          ml={8}
          size="xsmall"
          variant="headline"
          style={{ fontWeight: 400 }}>
          {props.token.displayName}
        </Typography>
      </div>
      <div className="usd-value">
        {props.type === 'input' && (
          <Typography mr={4} size="small" variant="body" color="$neutral900">
            {`~$${props.price.usdValue}`}
          </Typography>
        )}
        {props.type === 'output' && (
          <PriceImpact
            size="small"
            outputUsdValue={props.price.usdValue}
            percentageChange={props.percentageChange}
            warningLevel={props.warningLevel}
          />
        )}
      </div>
    </Container>
  );
}
