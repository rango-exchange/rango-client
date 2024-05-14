import type { PriceImpactPropTypes } from './PriceImpact.types';

import React from 'react';

import { Divider, Tooltip, Typography } from '..';

import { Container, OutputUsdValue } from './PriceImpact.styles';

export function PriceImpact(props: PriceImpactPropTypes) {
  const {
    size = 'medium',
    outputUsdValue,
    outputColor,
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
          <OutputUsdValue
            size={size}
            variant="body"
            color={outputColor || '$neutral600'}>
            {outputUsdValue === '0' ? '0.00' : `~$${outputUsdValue}`}
          </OutputUsdValue>
        </Tooltip>
      )}
      {((outputUsdValue && percentageChange) || !outputUsdValue) && (
        <>
          <Divider direction="horizontal" size={4} />

          <Typography size={size} variant="body" color={percentageChangeColor}>
            {outputUsdValue &&
              percentageChange &&
              `(${
                percentageChange.includes('-')
                  ? percentageChange
                  : `-${percentageChange}`
              }${percentageChange ? '%' : '-'})`}

            {!outputUsdValue && error}
          </Typography>
        </>
      )}
    </Container>
  );
}
