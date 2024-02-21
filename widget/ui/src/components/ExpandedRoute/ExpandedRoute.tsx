import type { PropTypes } from './ExpandedRoute.types';

import React from 'react';

import { ErrorIcon, WarningIcon } from '../../icons';
import { ChainToken } from '../ChainToken';
import { Image } from '../common';
import { Divider } from '../Divider';
import { QuoteCost } from '../QuoteCost';
import { QuoteTag } from '../QuoteTag';
import { Tooltip } from '../Tooltip';
import { Typography } from '../Typography';

import {
  FromToken,
  IconHighlight,
  lastStepStyle,
  LeftSection,
  OutputSection,
  RightSection,
  RouteContainer,
  RouteHeader,
  Step,
  Steps,
  StyledPriceImpact,
  SwapperContainer,
  SwapperImage,
  TagsContainer,
  tokenLabelStyles,
  VerticalLine,
} from './ExpandedRoute.styles';

export function ExpandedRoute(props: PropTypes) {
  const {
    steps,
    tags,
    time,
    fee,
    percentageChange,
    warningLevel,
    outputPrice,
    tooltipContainer,
    selected = false,
    onClick,
  } = props;
  const numberOfSteps = steps.length;
  return (
    <RouteContainer selected={selected} onClick={onClick}>
      <RouteHeader>
        <QuoteCost fee={fee} time={time} steps={numberOfSteps} />
        <TagsContainer>
          {tags.map((tag) => (
            <QuoteTag key={tag.label} label={tag.label} value={tag.value} />
          ))}
        </TagsContainer>
      </RouteHeader>
      <Steps>
        {steps.map((step, index) => {
          const key = `item-${index}`;
          return (
            <Step
              key={key}
              className={index === numberOfSteps - 1 ? lastStepStyle() : ''}>
              <LeftSection>
                <ChainToken
                  size="small"
                  chainImage={step.from.chain.image}
                  tokenImage={step.from.token.image}
                />
                <FromToken>
                  <Tooltip
                    content={step.from.price.realValue}
                    container={tooltipContainer}
                    side="bottom"
                    open={!step.from.price.realValue ? false : undefined}>
                    <Typography size="xsmall" variant="body">
                      {step.from.price.value}
                    </Typography>
                  </Tooltip>
                  <Typography
                    size="xsmall"
                    variant="body"
                    className={tokenLabelStyles()}>
                    {step.from.token.displayName}
                  </Typography>
                </FromToken>
              </LeftSection>
              <RightSection>
                <SwapperContainer>
                  <SwapperImage state={step.state}>
                    <Image size={15} type="circular" src={step.swapper.image} />
                    {step.state && (
                      <IconHighlight type={step.state}>
                        {step.state === 'error' ? (
                          <ErrorIcon size={6} color="error" />
                        ) : (
                          <WarningIcon size={6} color="warning" />
                        )}
                      </IconHighlight>
                    )}
                  </SwapperImage>
                  <Typography size="xsmall" variant="body" align="center">
                    {step.swapper.displayName}
                  </Typography>
                </SwapperContainer>
                <VerticalLine />
              </RightSection>
            </Step>
          );
        })}
        <OutputSection>
          <ChainToken
            chainImage={steps[numberOfSteps - 1].to.chain.image}
            tokenImage={steps[numberOfSteps - 1].to.token.image}
            size="medium"
          />
          <div>
            <div>
              <Tooltip
                content={outputPrice.realValue}
                container={tooltipContainer}
                open={!outputPrice.realValue ? false : undefined}>
                <Typography size="xmedium" variant="title">
                  {outputPrice.value}
                </Typography>
                <Divider size={4} direction="horizontal" />
                <Typography size="large" variant="body">
                  {steps[numberOfSteps - 1].to.token.displayName}
                </Typography>
              </Tooltip>
            </div>
          </div>
          <StyledPriceImpact
            size="xsmall"
            warningLevel={warningLevel}
            outputUsdValue={outputPrice.usdValue}
            realOutputUsdValue={outputPrice.realUsdValue}
            percentageChange={percentageChange}
            tooltipProps={{
              container: tooltipContainer,
            }}
          />
        </OutputSection>
      </Steps>
    </RouteContainer>
  );
}
