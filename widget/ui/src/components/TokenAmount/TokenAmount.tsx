import type { PropTypes } from './TokenAmount.types.js';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { useIsTruncated } from 'src/hooks/useIsTruncated.js';
import { InfoIcon } from 'src/icons/index.js';

import { ChainToken } from '../ChainToken/index.js';
import { Divider } from '../Divider/index.js';
import { PriceImpact } from '../PriceImpact/index.js';
import { ValueTypography } from '../PriceImpact/PriceImpact.styles.js';
import { NumericTooltip, Tooltip } from '../Tooltip/index.js';
import { Typography } from '../Typography/index.js';

import {
  centeredFlexBox,
  Container,
  textTruncate,
  tokenAmountStyles,
  TokenNameText,
  tooltipRootStyle,
  usdValueStyles,
} from './TokenAmount.styles.js';

const TOKEN_NAME_TRUNCATE_THRESHOLD = 11;
const MAX_VERTICAL_PRICE_VALUE_LENGTH = 30;
const MAX_LEFT_WIDTH = 200;

export function TokenAmount(props: PropTypes) {
  const isVertical = props.direction === 'vertical';
  const isHorizontal = props.direction === 'horizontal';
  const realValueRef = useRef<HTMLSpanElement | null>(null);
  const isRealValueTruncated = useIsTruncated(
    props.price.realValue,
    realValueRef
  );
  const realUSdValueRef = useRef<HTMLSpanElement | null>(null);
  const isRealUsedValueTruncated = useIsTruncated(
    props.price.realUsdValue,
    realUSdValueRef
  );
  const leftBoxRef = useRef<HTMLDivElement | null>(null);
  const [isLeftAtMax, setIsLeftAtMax] = useState(false);

  useLayoutEffect(() => {
    if (!leftBoxRef.current) {
      return;
    }

    const el = leftBoxRef.current;
    const ro = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setIsLeftAtMax(width >= MAX_LEFT_WIDTH);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <Container
      direction={props.direction}
      centerAlign={props.centerAlign}
      id={props.id}>
      <div
        className={tokenAmountStyles()}
        ref={leftBoxRef}
        style={{
          flexDirection:
            props.price.realValue &&
            props.price.realValue?.length > MAX_VERTICAL_PRICE_VALUE_LENGTH &&
            isVertical
              ? 'column'
              : 'row',
        }}>
        <ChainToken
          chainImage={props.chain.image}
          tokenImage={props.token.image}
          size="medium"
        />

        <Divider direction="horizontal" size={4} />
        <div style={{ minWidth: 0 }}>
          {props.label && (
            <Typography size="xsmall" variant="body" color="$neutral700">
              {props.label}
            </Typography>
          )}
          <div style={{ minWidth: 0 }} className={centeredFlexBox()}>
            <Typography
              className={textTruncate()}
              ref={realValueRef}
              size="medium"
              variant="title"
              style={{
                fontWeight: 600,
                ...(isHorizontal && {
                  flexShrink: 1,
                  minWidth: 0,
                }),
                ...(isVertical && {
                  whiteSpace: 'normal',
                  wordBreak: 'break-all',
                }),
              }}>
              {props.price.realValue}
            </Typography>
            {isHorizontal && props.price.realValue && isRealValueTruncated && (
              <NumericTooltip
                styles={{ root: tooltipRootStyle }}
                content={props.price.realValue}
                open={!props.price.realValue ? false : undefined}
                container={props.tooltipContainer}>
                <InfoIcon size={12} color="gray" />
              </NumericTooltip>
            )}
            {isHorizontal && (
              <>
                <Divider direction="horizontal" size={8} />
                <TokenNameText
                  className={textTruncate()}
                  size="medium"
                  variant="title"
                  style={{ fontWeight: 400 }}>
                  {props.token.displayName}
                </TokenNameText>
                <Divider direction="horizontal" size={2} />
                {props.token.displayName.length >
                  TOKEN_NAME_TRUNCATE_THRESHOLD && (
                  <Tooltip
                    content={props.token.displayName}
                    container={props.tooltipContainer}>
                    <InfoIcon size={12} color="gray" />
                  </Tooltip>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {isVertical && (
        <div className={tokenAmountStyles()}>
          <TokenNameText
            className={textTruncate()}
            size="medium"
            variant="title"
            style={{ fontWeight: 400 }}>
            {props.token.displayName}
          </TokenNameText>
          <Divider direction="horizontal" size={2} />
          {props.token.displayName.length > TOKEN_NAME_TRUNCATE_THRESHOLD && (
            <Tooltip
              content={props.token.displayName}
              container={props.tooltipContainer}>
              <InfoIcon size={12} color="gray" />
            </Tooltip>
          )}
        </div>
      )}
      {props.price.usdValue && props.price.usdValue !== '0' && (
        <div className={usdValueStyles()}>
          {props.type === 'input' && (
            <ValueTypography style={{ maxWidth: 88 }}>
              <Typography
                size="small"
                variant="body"
                ref={realUSdValueRef}
                className={textTruncate()}>
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
              style={{
                minWidth: 0,
                flexShrink: 1,
                maxWidth: 88,
                flexDirection: isLeftAtMax ? 'column' : 'row',
                alignItems: isLeftAtMax ? 'flex-end' : 'center',
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
