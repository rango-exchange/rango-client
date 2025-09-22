import type { SwapInputPropTypes } from './SwapInput.types.js';

import React from 'react';

import {
  Divider,
  NumericTooltip,
  PriceImpact,
  Skeleton,
  Typography,
} from '../../components/index.js';
import { UI_ID } from '../../constants/index.js';

import {
  amountStyles,
  Container,
  formStyles,
  InputAmount,
  labelContainerStyles,
  labelStyles,
  textStyles,
  TokenSectionContainer,
  TokenValue,
  UsdPrice,
  ValueTypography,
} from './SwapInput.styles.js';
import { TokenSection } from './TokenSection.js';

export function SwapInput(props: SwapInputPropTypes) {
  const price = props.price;

  const isUsdValueZeroOrFalsy =
    !props.price.usdValue || props.price.usdValue === '0';

  const displayUsdValue =
    props.price.error ||
    (isUsdValueZeroOrFalsy ? '0.00' : `~$${props.price.usdValue}`);

  return (
    <Container
      id={
        props.mode === 'To'
          ? UI_ID.SWAP_TO_INPUT_CONTAINER_ID
          : UI_ID.SWAP_FROM_INPUT_CONTAINER_ID
      }
      sharpBottomStyle={props.sharpBottomStyle}>
      <div className={labelContainerStyles()}>
        <div className={labelStyles()}>
          <Typography variant="body" size="small" className={textStyles()}>
            {props.label}
          </Typography>
        </div>
      </div>
      <div className={formStyles()}>
        <TokenSectionContainer>
          <TokenSection
            id={`${props.id}-token-selection-container`}
            chain={props.chain.displayName}
            chianImageId={
              props.mode === 'To'
                ? UI_ID.SWAP_TO_CHAIN_IMAGE_ID
                : UI_ID.SWAP_FROM_CHAIN_IMAGE_ID
            }
            tokenSymbol={props.token.displayName}
            error={props.error}
            chainImage={props.chain.image}
            tokenImage={props.token.image}
            onClick={props.onClickToken}
            loading={props.loading}
            warning={props.token.securityWarning}
            tooltipContainer={props.tooltipContainer}
          />
        </TokenSectionContainer>
        <div className={amountStyles()}>
          {props.loading || (props.mode === 'To' && props.fetchingQuote) ? (
            <>
              <Skeleton variant="text" size="large" />
              <Divider size={8} />
              <Skeleton variant="text" size="medium" />
            </>
          ) : (
            <>
              <NumericTooltip
                align="end"
                content={price.realValue}
                container={props.tooltipContainer}
                open={
                  !price.realValue || price.realValue === '0'
                    ? false
                    : undefined
                }>
                <InputAmount
                  disabled={props.disabled || props.mode === 'To'}
                  style={{ padding: 0 }}
                  value={price.value}
                  id={`${props.id}-input`}
                  type={'onInputChange' in props ? 'number' : 'text'}
                  step="any"
                  size="large"
                  placeholder="0"
                  variant="ghost"
                  {...('onInputBlur' in props && {
                    onBlur: (event: React.ChangeEvent<HTMLInputElement>) =>
                      props.onInputBlur?.(event.target.value),
                  })}
                  min={0}
                  {...('onInputChange' in props && {
                    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                      props.onInputChange(event.target.value),
                  })}
                />
              </NumericTooltip>
            </>
          )}
        </div>
      </div>
      <Divider size={4} />
      <TokenValue>
        {'percentageChange' in props ? (
          <PriceImpact
            size="medium"
            tooltipProps={{
              container: props.tooltipContainer,
              side: 'bottom',
            }}
            outputUsdValue={price.usdValue}
            realOutputUsdValue={price.realUsdValue}
            error={price.error}
            percentageChange={props.percentageChange}
            warningLevel={props.warningLevel}
          />
        ) : (
          <NumericTooltip
            content={price.realUsdValue}
            container={props.tooltipContainer}
            open={isUsdValueZeroOrFalsy ? false : undefined}
            side="bottom">
            <ValueTypography hasWarning={!!price.error}>
              <UsdPrice variant="body" size="medium">
                {displayUsdValue}
              </UsdPrice>
            </ValueTypography>
          </NumericTooltip>
        )}
        {props.moreInfo}
      </TokenValue>
    </Container>
  );
}
