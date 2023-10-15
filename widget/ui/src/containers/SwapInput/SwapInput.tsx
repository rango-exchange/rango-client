import type { SwapInputProps } from './SwapInput.types';

import { i18n } from '@lingui/core';
import React from 'react';

import { Divider, PriceImpact, Skeleton, Typography } from '../../components';

import { Container, InputAmount, MaxButton } from './SwapInput.styles';
import { TokenSection } from './TokenSection';

export function SwapInput(props: SwapInputProps) {
  return (
    <Container sharpBottomStyle={props.sharpBottomStyle}>
      <div className="label__container">
        <div className="label">
          <Typography variant="body" size="small" color="$neutral800">
            {props.label}
          </Typography>
          {'balance' in props && !props.loading && (
            <div className="balance">
              <Typography
                color="$neutral800"
                mr={4}
                variant="body"
                size="xsmall">
                {i18n.t('Balance')}: {props.balance}
              </Typography>
              <MaxButton
                variant="default"
                size="xsmall"
                onClick={props.onSelectMaxBalance}>
                <Typography variant="body" size="xsmall" color="secondary500">
                  {i18n.t('Max')}
                </Typography>
              </MaxButton>
            </div>
          )}
          {props.loading && (
            <div className="balance">
              <Skeleton variant="text" size="large" width={105} />
            </div>
          )}
        </div>
      </div>
      <div className="form">
        <TokenSection
          chain={props.chain.displayName}
          tokenSymbol={props.token.displayName}
          error={props.error}
          chainImage={props.chain.image}
          tokenImage={props.token.image}
          onClick={props.onClickToken}
          loading={props.loading}
        />
        <div className="amount">
          {props.loading ? (
            <>
              <Skeleton variant="text" size="large" width={92} />
              <Divider size={8} />
              <Skeleton variant="text" size="medium" width={92} />
            </>
          ) : (
            <>
              <InputAmount
                disabled={props.disabled || props.mode === 'To'}
                style={{ padding: 0 }}
                value={props.price.value}
                type={'onInputChange' in props ? 'number' : 'text'}
                size="large"
                placeholder="0"
                variant="ghost"
                min={0}
                {...('onInputChange' in props && {
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                    props.onInputChange(event.target.value),
                })}
              />
              {'percentageChange' in props ? (
                <PriceImpact
                  size="large"
                  outputUsdValue={props.price.usdValue}
                  error={props.price.error}
                  percentageChange={props.percentageChange}
                  warningLevel={props.warningLevel}
                />
              ) : (
                <Typography
                  variant="body"
                  size="medium"
                  color={!props.price.error ? '$neutral800' : '$warning500'}
                  style={{
                    width: 140,
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                  {props.price.usdValue
                    ? `~$${props.price.usdValue}`
                    : props.price.error}
                </Typography>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
