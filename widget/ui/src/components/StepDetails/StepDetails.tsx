import type { InternalSwap, StepDetailsProps } from './StepDetails.types.js';

import { i18n } from '@lingui/core';
import React, { forwardRef, Fragment, memo, useEffect, useRef } from 'react';

import { ChainToken } from '../../components/ChainToken/index.js';
import { NextIcon } from '../../icons/index.js';
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
  tokensContainerStyles,
  tokensStyles,
} from './StepDetails.styles.js';

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
    } = props;

    const { from, to, swapper } = step;
    const containerRef = useRef<HTMLDivElement>(null);
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
      const childElement = containerRef.current;
      if (isFocused && childElement && parentElement) {
        parentElement.scrollTop =
          childElement.offsetTop - parentElement.offsetTop;
      }
    }, [isFocused]);

    return (
      <Container
        type={type}
        state={state}
        ref={containerRef}
        tabIndex={tabIndex}>
        {type === 'quote-details' && (
          <div className={swapperItemStyles()}>
            <SwapperImage state={state}>
              <Image size={22} src={step.swapper.image} />
            </SwapperImage>
            <Divider direction="horizontal" size={8} />
            <Typography size="medium" variant="label">
              {i18n.t({
                id: 'Swap on {fromChain} via {swapper}',
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
                <Typography
                  size="small"
                  color="$neutral700"
                  variant="body">{`${step.from.price.value} ${step.from.token.displayName}`}</Typography>
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

                <Typography size="small" color="$neutral700" variant="body">{`${
                  isCompleted ? '' : '~'
                }${step.to.price.value} ${
                  step.to.token.displayName
                }`}</Typography>
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
