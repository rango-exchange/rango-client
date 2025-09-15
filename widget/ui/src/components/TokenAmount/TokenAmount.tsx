import type { PropTypes } from './TokenAmount.types.js';

import React, { useRef } from 'react';
import { useIsTruncated } from 'src/hooks/useIsTruncated.js';
import { InfoIcon } from 'src/icons/index.js';

import { ChainToken } from '../ChainToken/index.js';
import { Divider } from '../Divider/index.js';
import { PriceImpact } from '../PriceImpact/index.js';
import { ValueTypography } from '../PriceImpact/PriceImpact.styles.js';
import { NumericTooltip, Tooltip } from '../Tooltip/index.js';
import { Typography } from '../Typography/index.js';

import {
  Container,
  flexShrink,
  flexShrinkFix,
  textTruncate,
  TokenAmountWrapper,
  TokenInfoRow,
  TokenNameText,
  tooltipRootStyle,
  usdValueStyles,
  usdValueText,
  verticalUsdValueText,
} from './TokenAmount.styles.js';

export function TokenAmount(props: PropTypes) {
  const realValueRef = useRef<HTMLSpanElement | null>(null);
  const isRealValueTruncated = useIsTruncated(
    props.price?.realValue || '',
    realValueRef
  );
  const realUSdValueRef = useRef<HTMLSpanElement | null>(null);
  const isRealUsedValueTruncated = useIsTruncated(
    props.price?.realUsdValue || '',
    realUSdValueRef
  );
  const displayNameRef = useRef<HTMLSpanElement | null>(null);
  const isDisplayNameTruncated = useIsTruncated(
    props.token.displayName,
    displayNameRef
  );
  return (
    <Container
      direction={props.direction}
      centerAlign={props.centerAlign}
      id={props.id}>
      <TokenAmountWrapper direction={props.direction}>
        <ChainToken
          chainImage={props.chain.image}
          tokenImage={props.token.image}
          size="medium"
        />

        <Divider direction="horizontal" size={4} />
        <div className={flexShrinkFix()}>
          {props.label && (
            <Typography size="xsmall" variant="body" color="$neutral700">
              {props.label}
            </Typography>
          )}
          <TokenInfoRow className={flexShrinkFix()}>
            <Typography
              size="medium"
              variant="title"
              ref={realValueRef}
              className={`${textTruncate()} ${flexShrinkFix()}`}
              style={{ fontWeight: 600 }}>
              {props.price.realValue}
            </Typography>
            {props.price.realValue && isRealValueTruncated && (
              <>
                <Divider direction="horizontal" size={2} />

                <NumericTooltip
                  styles={{ root: tooltipRootStyle }}
                  content={props.price.realValue}
                  open={!props.price.realValue ? false : undefined}
                  container={props.tooltipContainer}>
                  <InfoIcon size={12} color="gray" />
                </NumericTooltip>
              </>
            )}
            <Divider direction="horizontal" size={8} />
            <TokenNameText
              size="medium"
              variant="title"
              className={textTruncate()}
              ref={displayNameRef}
              style={{ fontWeight: 400 }}>
              {props.token.displayName}
            </TokenNameText>
            {isDisplayNameTruncated && (
              <>
                <Divider direction="horizontal" size={2} />
                <Tooltip
                  content={props.token.displayName}
                  container={props.tooltipContainer}>
                  <InfoIcon size={12} color="gray" />
                </Tooltip>
              </>
            )}
          </TokenInfoRow>
        </div>
      </TokenAmountWrapper>
      {props.price.usdValue && props.price.usdValue !== '0' && (
        <div className={usdValueStyles()}>
          {props.type === 'input' && (
            <ValueTypography className={usdValueText()}>
              <Typography
                ref={realUSdValueRef}
                className={textTruncate()}
                size="small"
                variant="body">
                {`~$${props.price.realUsdValue}`}
              </Typography>
              {isRealUsedValueTruncated && (
                <NumericTooltip
                  content={props.price.realUsdValue}
                  container={props.tooltipContainer}>
                  <InfoIcon size={12} color="gray" />
                </NumericTooltip>
              )}
            </ValueTypography>
          )}
          {props.type === 'output' && (
            <PriceImpact
              className={`${
                props.direction === 'horizontal'
                  ? usdValueText()
                  : verticalUsdValueText()
              } ${flexShrinkFix()} ${flexShrink()}`}
              style={{
                ...(props.direction === 'horizontal' && { flexWrap: 'wrap' }),
              }}
              size="small"
              tooltipProps={{ container: props.tooltipContainer, side: 'top' }}
              outputUsdValue={props.price.usdValue}
              percentageChange={props.percentageChange}
              warningLevel={props.warningLevel}
              realOutputUsdValue={props.price.realUsdValue}
            />
          )}
        </div>
      )}
    </Container>
  );
}
