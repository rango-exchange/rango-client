import type { PriceImpactProps } from './PriceImpact.types';

import React from 'react';

import { Typography } from '..';

import { Container } from './PriceImpact.styles';

export function PriceImpact(props: PriceImpactProps) {
  const { size, outputUsdValue, percentageChange, warningLevel, error } = props;

  let percentageChangeColor = '';
  if (!outputUsdValue || warningLevel === 'low') {
    percentageChangeColor = '$warning500';
  } else if (warningLevel === 'high') {
    percentageChangeColor = '$error500';
  }

  return (
    <Container>
      {outputUsdValue && (
        <Typography
          size={size === 'small' ? 'small' : 'medium'}
          variant="body"
          color={size !== 'small' ? '$neutral800' : undefined}>
          {`~$${outputUsdValue}`}
        </Typography>
      )}
      {((outputUsdValue && percentageChange) || !outputUsdValue) && (
        <Typography
          size={size === 'small' ? 'small' : 'medium'}
          variant="body"
          ml={4}
          color={percentageChangeColor}>
          {outputUsdValue &&
            percentageChange &&
            `(${percentageChange}${percentageChange ? '%' : '-'})`}

          {!outputUsdValue && error}
        </Typography>
      )}
    </Container>
  );
}
