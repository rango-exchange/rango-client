import type { PriceImpactProps } from './PriceImpact.types';

import React from 'react';

import { Tooltip, Typography } from '..';

import { Container, OutputUsdValue } from './PriceImpact.styles';

export function PriceImpact(props: PriceImpactProps) {
  const {
    size = 'medium',
    outputUsdValue,
    realOutputUsdValue,
    percentageChange,
    warningLevel,
    error,
    tooltipProps,
    ...rest
  } = props;

  let percentageChangeColor = '$neutral600';
  if (!outputUsdValue || warningLevel === 'low') {
    percentageChangeColor = '$warning500';
  } else if (warningLevel === 'high') {
    percentageChangeColor = '$error500';
  }

  return (
    <Container {...rest}>
      {outputUsdValue && (
        <Tooltip
          content={realOutputUsdValue}
          container={tooltipProps?.container}
          open={
            !realOutputUsdValue || realOutputUsdValue === '0'
              ? false
              : undefined
          }
          side={tooltipProps?.side}>
          <OutputUsdValue size={size} variant="body" color="$neutral600">
            {`~$${outputUsdValue}`}
          </OutputUsdValue>
        </Tooltip>
      )}
      {((outputUsdValue && percentageChange) || !outputUsdValue) && (
        <Typography
          size={size}
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
