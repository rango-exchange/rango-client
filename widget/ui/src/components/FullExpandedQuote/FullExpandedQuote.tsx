import type { DataLoadedProps, PropTypes } from './FullExpandedQuote.types.js';
import type { Tag } from 'rango-types/lib/api/main';

import { i18n } from '@lingui/core';
import React, { useState } from 'react';

import { ErrorIcon, InfoIcon, WarningIcon } from '../../icons/index.js';
import { ChainToken } from '../ChainToken/index.js';
import { Image } from '../common/index.js';
import { Divider } from '../Divider/index.js';
import { QuoteTag } from '../QuoteTag/index.js';
import { textTruncate } from '../TokenAmount/TokenAmount.styles.js';
import { NumericTooltip, Tooltip } from '../Tooltip/index.js';
import { Typography } from '../Typography/index.js';

import {
  getTagLabel,
  ITEM_SKELETON_COUNT,
  shortenAmount,
  shortenDisplayName,
  TOOLTIP_SIDE_OFFSET,
} from './FullExpandedQuote.helpers.js';
import {
  SkeletonHeader,
  SkeletonItemLeft,
  SkeletonItemRight,
  SkeletonOutput,
} from './FullExpandedQuote.Skeletons.js';
import {
  IconHighlight,
  lastStepStyle,
  OutputPriceValue,
  OutputSection,
  RouteContainer,
  RouteHeader,
  StepItem,
  StepItemContainer,
  Steps,
  StyledPriceImpact,
  SwapperContainer,
  SwapperContent,
  SwapperImage,
  SwapperImagesContainer,
  SwapperSection,
  TagsContainer,
  VerticalLine,
} from './FullExpandedQuote.styles.js';
import { TokenSection } from './FullExpandedQuote.TokenSection.js';
import { TooltipContent } from './FullExpandedQuote.Tooltip.js';

const MAX_OUTPUT_AMOUNT_LENGTH_FOR_INFO_ICON = 7;
export function FullExpandedQuote(props: PropTypes) {
  const {
    loading,
    percentageChange,
    warningLevel,
    tooltipContainer,
    onClick,
    selected = false,
    id,
  } = props;
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);

  const steps: DataLoadedProps['steps'] = loading
    ? Array(ITEM_SKELETON_COUNT).fill(undefined)
    : props.steps;
  const numberOfSteps = steps.length;

  return (
    <RouteContainer
      id={id}
      selected={selected}
      onClick={onClick}
      hovered={hoveredItemIndex !== null}>
      <RouteHeader loading={loading}>
        {loading ? (
          <SkeletonHeader />
        ) : (
          <>
            {props.quoteCost}
            <TagsContainer>
              {props.tags.map((tag) => (
                <QuoteTag
                  key={tag.label}
                  label={getTagLabel(tag.value as Tag, i18n.t)}
                  value={tag.value}
                />
              ))}
            </TagsContainer>
          </>
        )}
      </RouteHeader>
      <Steps>
        {steps.map((step, index) => {
          const key = `item-${index}`;
          const isStepHovered = hoveredItemIndex === index;
          const isLastItem = index === numberOfSteps - 1;
          const isFirstItem = index === 0;
          return (
            <StepItem
              key={key}
              isHovered={isStepHovered}
              style={{
                marginLeft: !isFirstItem && !loading ? '-47px' : '0px',
              }}>
              <Tooltip
                container={tooltipContainer}
                side="bottom"
                align={isLastItem && !isFirstItem ? 'end' : 'start'}
                sideOffset={TOOLTIP_SIDE_OFFSET}
                open={!loading && isStepHovered}
                styles={{
                  root: {
                    width: '100%',
                  },
                  content: {
                    borderRadius: '5px',
                    padding: '10px',
                    backgroundColor: '$neutral400 !important',
                  },
                }}
                content={
                  !loading ? (
                    <TooltipContent
                      internalSwaps={step.internalSwaps || []}
                      time={step.time || ''}
                      fee={step.fee || ''}
                      alerts={step.alerts}
                    />
                  ) : null
                }>
                <StepItemContainer>
                  {loading ? (
                    <SkeletonItemLeft />
                  ) : (
                    <TokenSection
                      style={{
                        opacity: hoveredItemIndex === index - 1 ? 0 : 1,
                      }}
                      chainImage={step.from.chain.image}
                      tokenImage={step.from.token.image}
                      amount={
                        isStepHovered
                          ? shortenAmount(step.from.price.value)
                          : step.from.price.value
                      }
                      name={
                        isStepHovered
                          ? shortenDisplayName(step.from.token.displayName)
                          : step.from.token.displayName
                      }
                      tooltipProps={{
                        content: step.from.price.realValue,
                        open: !step.from.price.realValue ? false : undefined,
                        container: tooltipContainer,
                      }}
                    />
                  )}
                  <SwapperSection className={isLastItem ? lastStepStyle() : ''}>
                    {loading ? (
                      <SkeletonItemRight />
                    ) : (
                      <>
                        <SwapperContainer>
                          <SwapperContent
                            onMouseEnter={() => setHoveredItemIndex(index)}
                            onMouseLeave={() => setHoveredItemIndex(null)}>
                            <SwapperImagesContainer>
                              {!step.internalSwaps ? (
                                <SwapperImage state={step.state}>
                                  <Image
                                    size={22}
                                    type="circular"
                                    src={step.swapper.image}
                                  />
                                </SwapperImage>
                              ) : (
                                step.internalSwaps.map(
                                  (internalswap, iIndex) => {
                                    const key = `${iIndex}-swapper-image`;
                                    return (
                                      <SwapperImage
                                        state={step.state}
                                        key={key}
                                        style={{
                                          marginLeft:
                                            iIndex !== 0 ? '-10px' : '0px',
                                        }}>
                                        <Image
                                          size={22}
                                          type="circular"
                                          src={internalswap.swapper.image}
                                        />
                                      </SwapperImage>
                                    );
                                  }
                                )
                              )}
                              {step.state && (
                                <IconHighlight type={step.state}>
                                  {step.state === 'error' ? (
                                    <ErrorIcon size={8} color="error" />
                                  ) : (
                                    <WarningIcon size={8} color="warning" />
                                  )}
                                </IconHighlight>
                              )}
                            </SwapperImagesContainer>

                            <Divider size={2} />
                            <Typography
                              size="xsmall"
                              variant="body"
                              align="center">
                              {step.swapper.displayName}
                            </Typography>
                          </SwapperContent>
                        </SwapperContainer>

                        <VerticalLine />
                      </>
                    )}
                  </SwapperSection>
                  {!loading && !isLastItem && (
                    <TokenSection
                      style={{
                        opacity: isStepHovered ? 1 : 0,
                      }}
                      chainImage={step.to.chain.image}
                      tokenImage={step.to.token.image}
                      amount={shortenAmount(step.to.price.value)}
                      name={shortenDisplayName(step.to.token.displayName)}
                    />
                  )}
                  {!loading && isLastItem && (
                    <OutputSection>
                      <ChainToken
                        chainImage={step.to.chain.image}
                        tokenImage={step.to.token.image}
                        size="medium"
                      />
                      <Divider size={4} />
                      <div>
                        <NumericTooltip
                          content={props.outputPrice.realValue}
                          container={tooltipContainer}
                          open={
                            !props.outputPrice.realValue ? false : undefined
                          }>
                          <OutputPriceValue
                            className={textTruncate()}
                            size="xmedium"
                            variant="title">
                            {props.outputPrice.value}
                          </OutputPriceValue>
                          {props.outputPrice.value.length >
                            MAX_OUTPUT_AMOUNT_LENGTH_FOR_INFO_ICON && (
                            <InfoIcon color="gray" size={12} />
                          )}
                          <Divider size={4} direction="horizontal" />
                          <Typography size="xmedium" variant="title">
                            {step.to.token.displayName}
                          </Typography>
                        </NumericTooltip>
                      </div>
                      <StyledPriceImpact
                        size="small"
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
                </StepItemContainer>
              </Tooltip>
            </StepItem>
          );
        })}

        {loading && <SkeletonOutput />}
      </Steps>
    </RouteContainer>
  );
}
