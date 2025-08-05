import type { InternalSwap, StepDetailsProps } from './StepDetails.types.js';

import { i18n } from '@lingui/core';
import React, { forwardRef, Fragment, memo, useEffect, useRef } from 'react';

import { ChainToken } from '../../components/ChainToken/index.js';
import { InfoIcon, NextIcon } from '../../icons/index.js';
import { Image } from '../common/index.js';
import { Divider } from '../Divider/index.js';
import { NumericTooltip } from '../Tooltip/index.js';
import { Typography } from '../Typography/index.js';

import {
  Alerts,
  Container,
  DashedLine,
  stepInfoStyles,
  StepSeparator,
  SwapperImage,
  swapperItemStyles,
  SwapperSeparator,
  swappersStyles,
  TokenNameText,
  tokensContainerStyles,
  tokensStyles,
  ValueTypography,
} from './StepDetails.styles.js';

const HIGHT_OF_STICKY_HEADER = 45;
const VALUE_LENGTH_THRESHOLD = 8;

const StepDetailsComponent = forwardRef<HTMLDivElement, StepDetailsProps>(
  (props, parentRef) => {
    const {
      step,
      hasSeparator,
      type,
      state,
      isFocused,
      tabIndex,
      tooltipContainer,
      className,
    } = props;

    const { from, to, swapper } = step;
    const containerRef = useRef<HTMLDivElement>(null);
    const childElement = containerRef.current;
    const isCompleted = state === 'completed' || state === 'error';
    const swappers: InternalSwap[] = step.internalSwaps?.length
      ? step.internalSwaps
      : [
          {
            from,
            to,
            swapper,
          },
        ];

    useEffect(() => {
      const parentElement = (parentRef as React.RefObject<HTMLDivElement>)
        ?.current;
      if (isFocused && childElement && parentElement) {
        parentElement.scrollTop =
          childElement.offsetTop - HIGHT_OF_STICKY_HEADER;
      }
    }, [isFocused, childElement]);

    return (
      <Container
        type={type}
        state={state}
        ref={containerRef}
        className={className}
        tabIndex={tabIndex}>
        {type === 'quote-details' && (
          <div className={swapperItemStyles()}>
            <SwapperImage state={state}>
              <Image size={22} src={step.swapper.image} />
            </SwapperImage>
            <Divider direction="horizontal" size={8} />
            <Typography size="medium" variant="label">
              {step.from.chain.displayName === step.to.chain.displayName
                ? i18n.t({
                    id: 'Swap on {fromChain} via {swapper}',
                    values: {
                      fromChain: step.from.chain.displayName,
                      swapper: step.swapper.displayName,
                    },
                  })
                : i18n.t({
                    id: 'Bridge from {fromChain} via {swapper}',
                    values: {
                      fromChain: step.from.chain.displayName,
                      swapper: step.swapper.displayName,
                    },
                  })}
            </Typography>
          </div>
        )}

        {type === 'swap-progress' && (
          <div className={swappersStyles()}>
            {hasSeparator && <StepSeparator state={state} />}
            {swappers.map((swapperItem, index) => {
              const key = `${swapperItem.swapper.displayName}-${index}`;
              return (
                <Fragment key={key}>
                  <div
                    id={swapperItem.swapper.displayName}
                    className={swapperItemStyles()}>
                    <SwapperImage state={state}>
                      <Image size={22} src={swapperItem.swapper.image} />
                    </SwapperImage>
                    <Divider direction="horizontal" size={8} />
                    <Typography size="medium" variant="label">
                      {swapperItem?.swapper.type === 'DEX'
                        ? i18n.t({
                            id: 'Swap on {fromChain} via {swapper}',
                            values: {
                              fromChain: swapperItem.from.chain.displayName,
                              swapper: swapperItem.swapper.displayName,
                            },
                          })
                        : i18n.t({
                            id: 'Bridge to {toChain} via {swapper}',
                            values: {
                              toChain: swapperItem.to.chain.displayName,
                              swapper: swapperItem.swapper.displayName,
                            },
                          })}
                    </Typography>
                  </div>
                  {index !== swappers.length - 1 && (
                    <SwapperSeparator state={state} />
                  )}
                </Fragment>
              );
            })}
          </div>
        )}

        <div className={stepInfoStyles()}>
          <DashedLine invisible={!hasSeparator || type === 'swap-progress'} />
          <div className={tokensContainerStyles()}>
            <div className={tokensStyles()}>
              <ChainToken
                chainImage={step.from.chain.image}
                tokenImage={step.from.token.image}
                size="small"
              />
              <NumericTooltip
                content={step.from.price.realValue}
                container={tooltipContainer}>
                <Divider direction="horizontal" size={4} />
                <ValueTypography
                  size="small"
                  color="$neutral700"
                  variant="body">{`${step.from.price.value}`}</ValueTypography>
                <Divider direction="horizontal" size={2} />

                {step.from.price.value.length > VALUE_LENGTH_THRESHOLD && (
                  <InfoIcon size={12} color="gray" />
                )}
                <Divider direction="horizontal" size={2} />

                <TokenNameText size="small" color="$neutral700" variant="body">
                  {step.from.token.displayName}
                </TokenNameText>
              </NumericTooltip>

              <Divider direction="horizontal" size={4} />

              <NextIcon color="gray" />
              <Divider size={4} direction="horizontal" />
              <ChainToken
                chainImage={step.to.chain.image}
                tokenImage={step.to.token.image}
                size="small"
              />
              <NumericTooltip
                content={step.to.price.realValue}
                container={tooltipContainer}>
                <Divider direction="horizontal" size={4} />

                <ValueTypography
                  size="small"
                  color="$neutral700"
                  variant="body">{`${isCompleted ? '' : '~'}${
                  step.to.price.value
                }`}</ValueTypography>
                <Divider direction="horizontal" size={2} />
                {step.to.price.value.length + (isCompleted ? 0 : 1) >
                  VALUE_LENGTH_THRESHOLD && <InfoIcon size={12} color="gray" />}
                <Divider direction="horizontal" size={2} />
                <TokenNameText size="small" color="$neutral700" variant="body">
                  {step.to.token.displayName}
                </TokenNameText>
              </NumericTooltip>
            </div>
            <Alerts pb={hasSeparator && type === 'quote-details'}>
              {step.alerts}
            </Alerts>
          </div>
        </div>
      </Container>
    );
  }
);

StepDetailsComponent.displayName = 'StepDetailsComponent';

export const StepDetails = memo(StepDetailsComponent);
