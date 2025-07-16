import type { PriceImpactPropTypes } from './PriceImpact.types.js';

import React from 'react';
import { InfoIcon } from 'src/icons/index.js';

import { Divider, NumericTooltip, Typography } from '../index.js';
import { USD_VALUE_TOOLTIP_THRESHOLD } from '../TokenAmount/TokenAmount.js';
import { textTruncate } from '../TokenAmount/TokenAmount.styles.js';

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
        <ValueTypography>
          <Typography
            className={textTruncate()}
            size={size}
            variant="body"
            color={outputColor}>
            {realOutputUsdValue === '0' ? '0.00' : `~$${realOutputUsdValue}`}
          </Typography>
          {realOutputUsdValue &&
            realOutputUsdValue.length > USD_VALUE_TOOLTIP_THRESHOLD && (
              <NumericTooltip
                content={realOutputUsdValue}
                container={tooltipProps?.container}
                side={tooltipProps?.side}>
                <InfoIcon size={12} color="gray" />
              </NumericTooltip>
            )}
        </ValueTypography>
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
