import type { PriceImpactPropTypes } from './PriceImpact.types';

import React from 'react';

import { Divider, Tooltip, Typography } from '..';

import { Container, ValueTypography } from './PriceImpact.styles';

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

  const hasWarning = !outputUsdValue || warningLevel === 'low';
  const hasError = warningLevel === 'high';

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
          <ValueTypography>
            <Typography size={size} variant="body" color={outputColor}>
              {outputUsdValue === '0' ? '0.00' : `~$${outputUsdValue}`}
            </Typography>
          </ValueTypography>
        </Tooltip>
      )}
      {((outputUsdValue && percentageChange) || !outputUsdValue) && (
        <ValueTypography hasError={hasError} hasWarning={hasWarning}>
          <Divider direction="horizontal" size={4} />
          <Typography size={size} variant="body">
            {outputUsdValue &&
              percentageChange &&
              `(${
                percentageChange.includes('-')
                  ? percentageChange
                  : `-${percentageChange}`
              }${percentageChange ? '%' : '-'})`}

            {!outputUsdValue && error}
          </Typography>
        </ValueTypography>
      )}
    </Container>
  );
}
