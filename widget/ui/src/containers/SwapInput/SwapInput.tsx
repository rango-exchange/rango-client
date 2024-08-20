import type { SwapInputPropTypes } from './SwapInput.types.js';

import { i18n } from '@lingui/core';
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
  balanceStyles,
  Container,
  formStyles,
  InputAmount,
  labelContainerStyles,
  labelStyles,
  MaxButton,
  textStyles,
  UsdPrice,
  ValueTypography,
} from './SwapInput.styles.js';
import { TokenSection } from './TokenSection.js';

export function SwapInput(props: SwapInputPropTypes) {
  const showBalance =
    'balance' in props &&
    !props.loading &&
    !props.loadingBalance &&
    props.token.displayName &&
    props.anyWalletConnected;

  const showBalanceSkeleton =
    'balance' in props && (props.loading || props.loadingBalance);
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
          {showBalance && (
            <div className={balanceStyles()}>
              <Typography className={textStyles()} variant="body" size="xsmall">
                {i18n.t('Balance')}: {props.balance}
              </Typography>
              <Divider direction="horizontal" size={4} />
              <MaxButton
                variant="default"
                size="xsmall"
                onClick={props.onSelectMaxBalance}>
                <Typography variant="body" size="xsmall">
                  {i18n.t('Max')}
                </Typography>
              </MaxButton>
            </div>
          )}
          {showBalanceSkeleton && (
            <div className={balanceStyles()}>
              <Skeleton variant="text" size="large" width={105} />
            </div>
          )}
        </div>
      </div>
      <div className={formStyles()}>
        <TokenSection
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
        />
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
                  type={'onInputChange' in props ? 'number' : 'text'}
                  step="any"
                  size="large"
                  placeholder="0"
                  variant="ghost"
                  min={0}
                  {...('onInputChange' in props && {
                    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                      props.onInputChange(event.target.value),
                  })}
                />
              </NumericTooltip>
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
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
