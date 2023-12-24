import type { PriceImpactProps } from './PriceImpact.types';

import React from 'react';

import { Typography } from '..';

import { Container, OutputUsdValue } from './PriceImpact.styles';

export function PriceImpact(props: PriceImpactProps) {
  const { size, outputUsdValue, percentageChange, warningLevel, error } = props;

  let percentageChangeColor = '$neutral600';
  if (!outputUsdValue || warningLevel === 'low') {
    percentageChangeColor = '$warning500';
  } else if (warningLevel === 'high') {
    percentageChangeColor = '$error500';
  }

  return (
    <Container>
      {outputUsdValue && (
        <OutputUsdValue
          size={size === 'small' ? 'small' : 'medium'}
          variant="body"
          color="$neutral600">
          {`~$${outputUsdValue}`}
        </OutputUsdValue>
      )}
      {((outputUsdValue && percentageChange) || !outputUsdValue) && (
        <Typography
          size={size === 'small' ? 'small' : 'medium'}
          variant="body"
          ml={4}
          color={percentageChangeColor}>
          {outputUsdValue &&
            percentageChange &&
            `(${
              percentageChange.includes('-')
                ? percentageChange
                : `-${percentageChange}`
            }${percentageChange ? '%' : '-'})`}

          {!outputUsdValue && error}
        </Typography>
      )}
    </Container>
  );
}
