import type { PriceImpactPropTypes } from './PriceImpact.types.js';

import React, { useRef } from 'react';
import { useIsTruncated } from 'src/hooks/useIsTruncated.js';
import { InfoIcon } from 'src/icons/index.js';

import { NumericTooltip, Typography } from '../index.js';
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
    style,
    ...rest
  } = props;

  const hasWarning = !outputUsdValue || warningLevel === 'low';
  const hasError = warningLevel === 'high';
  const realOutputUsdValueRef = useRef<HTMLSpanElement | null>(null);
  const isRealOutputUsdValueTruncated = useIsTruncated(
    realOutputUsdValue || '',
    realOutputUsdValueRef
  );

  const percentageValueRef = useRef<HTMLSpanElement | null>(null);
  const isPercentageValueTruncated = useIsTruncated(
    `(-${percentageChange}%)`,
    percentageValueRef
  );

  return (
    <Container
      {...rest}
      style={{
        ...style,
        ...(isPercentageValueTruncated && {
          flexWrap: 'wrap',
        }),
      }}>
      {outputUsdValue && (
        <ValueTypography className={textTruncate()}>
          <Typography
            className={`${textTruncate()} output-usd-value`}
            size={size}
            ref={realOutputUsdValueRef}
            variant="body"
            color={outputColor}>
            {realOutputUsdValue === '0' ? '0.00' : `~$${realOutputUsdValue}`}
          </Typography>
          {isRealOutputUsdValueTruncated && (
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
          <Typography
            ref={percentageValueRef}
            className="percentage-value"
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
          </Typography>
        </ValueTypography>
      )}
    </Container>
  );
}
