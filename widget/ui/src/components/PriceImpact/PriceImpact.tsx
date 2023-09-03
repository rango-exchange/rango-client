import type { PriceImpactProps } from './PriceImpact.types';

import React from 'react';

import { Typography } from '..';

import { Container } from './PriceImpact.styles';

export function PriceImpact(props: PriceImpactProps) {
  const { size, outputUsdValue, percentageChange, warningLevel } = props;

  let percentageChangeColor = '';
  if (!outputUsdValue || warningLevel === 'low') {
    percentageChangeColor = '$warning';
  } else if (warningLevel === 'high') {
    percentageChangeColor = '$error';
  }

  return (
    <Container>
      {outputUsdValue && (
        <Typography
          mr={4}
          size={size === 'small' ? 'small' : 'medium'}
          variant="body"
          color={size === 'small' ? '$neutral800' : '$neutral400'}>
          {`~$${outputUsdValue}`}
        </Typography>
      )}
      <Typography
        size={size === 'small' ? 'small' : 'medium'}
        variant="body"
        color={percentageChangeColor}>
        {outputUsdValue &&
          percentageChange &&
          `(-${percentageChange}${percentageChange ? '%' : ''})`}

        {!outputUsdValue && 'USD price unknown'}
      </Typography>
    </Container>
  );
}
