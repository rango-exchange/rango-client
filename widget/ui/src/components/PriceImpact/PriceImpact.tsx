import type { PriceImpactPropTypes } from './PriceImpact.types.js';

import React from 'react';

import { Divider, NumericTooltip, Typography } from '../index.js';

import { Container, ValueTypography } from './PriceImpact.styles.js';

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
        <NumericTooltip
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
        </NumericTooltip>
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
