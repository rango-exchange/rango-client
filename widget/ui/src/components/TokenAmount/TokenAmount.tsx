import type { PropTypes } from './TokenAmount.types.js';

import React from 'react';
import { InfoIcon } from 'src/icons/index.js';

import { ChainToken } from '../ChainToken/index.js';
import { Divider } from '../Divider/index.js';
import { PriceImpact } from '../PriceImpact/index.js';
import { ValueTypography } from '../PriceImpact/PriceImpact.styles.js';
import { NumericTooltip, Tooltip } from '../Tooltip/index.js';
import { Typography } from '../Typography/index.js';

import {
  Container,
  textTruncate,
  tokenAmountStyles,
  TokenNameText,
  tooltipRootStyle,
  usdValueStyles,
} from './TokenAmount.styles.js';

const TOKEN_NAME_TRUNCATE_THRESHOLD = 11;
const PRICE_VALUE_TOOLTIP_THRESHOLD = 14;
export const USD_VALUE_TOOLTIP_THRESHOLD = 7;
const MAX_VERTICAL_PRICE_VALUE_LENGTH = 30;

export function TokenAmount(props: PropTypes) {
  const isVertical = props.direction === 'vertical';
  const isHorizontal = props.direction === 'horizontal';
  return (
    <Container
      direction={props.direction}
      centerAlign={props.centerAlign}
      id={props.id}>
      <div
        className={tokenAmountStyles()}
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
        <div>
          {props.label && (
            <Typography size="xsmall" variant="body" color="$neutral700">
              {props.label}
            </Typography>
          )}
          <div className={tokenAmountStyles()}>
            <Typography
              className={textTruncate()}
              size="medium"
              variant="title"
              style={{
                fontWeight: 600,
                ...(isHorizontal && {
                  maxWidth: '154px',
                }),
                ...(isVertical && {
                  whiteSpace: 'normal',
                  wordBreak: 'break-all',
                }),
              }}>
              {props.price.realValue}
            </Typography>
            {isHorizontal &&
              props.price.realValue &&
              props.price.realValue?.length > PRICE_VALUE_TOOLTIP_THRESHOLD && (
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
            <ValueTypography>
              <Typography
                size="small"
                variant="body"
                className={textTruncate()}>
                {`~$${props.price.realUsdValue}`}
              </Typography>
              {props.price.realUsdValue &&
                props.price.realUsdValue.length >
                  USD_VALUE_TOOLTIP_THRESHOLD && (
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
