import type { PriceImpactPropTypes } from './PriceImpact.types';

import React from 'react';

import { Divider, Tooltip } from '..';

import {
  Container,
  OutputUsdValue,
  PercentageChange,
} from './PriceImpact.styles';

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
          <OutputUsdValue size={size} variant="body" color={outputColor}>
            {outputUsdValue === '0' ? '0.00' : `~$${outputUsdValue}`}
          </OutputUsdValue>
        </Tooltip>
      )}
      {((outputUsdValue && percentageChange) || !outputUsdValue) && (
        <>
          <Divider direction="horizontal" size={4} />
          <PercentageChange
            hasError={hasError}
            hasWarning={hasWarning}
            size={size}
            variant="body">
            {outputUsdValue &&
              percentageChange &&
              `(${
                percentageChange.includes('-')
                  ? percentageChange
                  : `-${percentageChange}`
              }${percentageChange ? '%' : '-'})`}

            {!outputUsdValue && error}
          </PercentageChange>
        </>
      )}
    </Container>
  );
}
