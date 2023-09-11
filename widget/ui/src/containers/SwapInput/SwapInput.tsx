import type { SwapInputProps } from './SwapInput.types';

import React from 'react';

import { Divider, PriceImpact, Skeleton, Typography } from '../../components';

import { Container, InputAmount, MaxButton } from './SwapInput.styles';
import { TokenSection } from './TokenSection';

export function SwapInput(props: SwapInputProps) {
  return (
    <Container>
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
                Balance: {props.balance}
              </Typography>
              <MaxButton
                variant="default"
                size="xsmall"
                onClick={props.onSelectMaxBalance}>
                <Typography variant="body" size="xsmall" color="secondary500">
                  Max
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
              <Divider size={4} />
              <Skeleton variant="text" size="medium" width={92} />
            </>
          ) : (
            <>
              <InputAmount
                disabled={props.disabled}
                style={{ padding: 0 }}
                value={props.price.value}
                type={'onInputChange' in props ? 'number' : 'text'}
                size="large"
                placeholder="0"
                variant="ghost"
                min={0}
                {...('onInputChange' in props && {
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                    props.onInputChange(event.target.value || '0'),
                })}
              />
              {'percentageChange' in props ? (
                <PriceImpact
                  size="large"
                  outputUsdValue={props.price.usdValue}
                  percentageChange={props.percentageChange}
                  warningLevel={props.warningLevel}
                />
              ) : (
                <Typography
                  variant="body"
                  size="medium"
                  color="$neutral800"
                  style={{
                    width: 140,
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                  {props.price.usdValue}
                </Typography>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
