import type { DataLoadedProps, PropTypes } from './FullExpandedQuote.types';

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
  SkeletonHeader,
  SkeletonItemLeft,
  SkeletonItemRight,
  SkeletonOutput,
} from './FullExpandedQuote.Skeletons';
import {
  FromToken,
  IconHighlight,
  lastStepStyle,
  LeftSection,
  OutputSection,
  RightSection,
  RouteContainer,
  RouteHeader,
  StepItem,
  Steps,
  StyledPriceImpact,
  SwapperContainer,
  SwapperImage,
  TagsContainer,
  tokenLabelStyles,
  VerticalLine,
} from './FullExpandedQuote.styles';

const ITEM_SKELETON_COUNT = 3;

export function FullExpandedQuote(props: PropTypes) {
  const {
    loading,
    percentageChange,
    warningLevel,
    tooltipContainer,
    onClick,
    selected = false,
  } = props;

  const steps: DataLoadedProps['steps'] = loading
    ? Array(ITEM_SKELETON_COUNT).fill(undefined)
    : props.steps;
  const numberOfSteps = steps.length;

  return (
    <RouteContainer selected={selected} onClick={onClick}>
      <RouteHeader loading={loading}>
        {loading ? (
          <SkeletonHeader />
        ) : (
          <>
            <QuoteCost
              fee={props.fee}
              time={props.time}
              steps={numberOfSteps}
            />
            <TagsContainer>
              {props.tags.map((tag) => (
                <QuoteTag key={tag.label} label={tag.label} value={tag.value} />
              ))}
            </TagsContainer>
          </>
        )}
      </RouteHeader>
      <Steps>
        {steps.map((step, index) => {
          const key = `item-${index}`;
          return (
            <StepItem
              key={key}
              className={index === numberOfSteps - 1 ? lastStepStyle() : ''}>
              {loading ? (
                <SkeletonItemLeft />
              ) : (
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
              )}
              <RightSection>
                {loading ? (
                  <SkeletonItemRight />
                ) : (
                  <>
                    <SwapperContainer>
                      <SwapperImage state={step.state}>
                        <Image
                          size={15}
                          type="circular"
                          src={step.swapper.image}
                        />
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
                  </>
                )}
              </RightSection>
            </StepItem>
          );
        })}
        {!loading && (
          <OutputSection>
            <ChainToken
              chainImage={steps[numberOfSteps - 1].to.chain.image}
              tokenImage={steps[numberOfSteps - 1].to.token.image}
              size="medium"
            />
            <div>
              <Tooltip
                content={props.outputPrice.realValue}
                container={tooltipContainer}
                open={!props.outputPrice.realValue ? false : undefined}>
                <Typography size="xmedium" variant="title">
                  {props.outputPrice.value}
                </Typography>
                <Divider size={4} direction="horizontal" />
                <Typography size="large" variant="body">
                  {steps[numberOfSteps - 1].to.token.displayName}
                </Typography>
              </Tooltip>
            </div>
            <StyledPriceImpact
              size="xsmall"
              warningLevel={warningLevel}
              outputUsdValue={props.outputPrice.usdValue}
              realOutputUsdValue={props.outputPrice.realUsdValue}
              percentageChange={percentageChange}
              tooltipProps={{
                container: tooltipContainer,
              }}
            />
          </OutputSection>
        )}
        {loading && <SkeletonOutput />}
      </Steps>
    </RouteContainer>
  );
}
