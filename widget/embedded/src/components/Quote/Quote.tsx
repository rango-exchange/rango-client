import type { QuoteProps } from './Quote.types';
import type { Step } from '@rango-dev/ui';
import type { SwapResult } from 'rango-sdk';

import { i18n } from '@lingui/core';
import {
  Alert,
  ChevronDownIcon,
  ChevronRightIcon,
  Divider,
  Image,
  InfoIcon,
  QuoteCost,
  StepDetails,
  TokenAmount,
  Tooltip,
  Typography,
} from '@rango-dev/ui';
import React, { useLayoutEffect, useRef, useState } from 'react';

import {
  GAS_FEE_MAX_DECIMALS,
  GAS_FEE_MIN_DECIMALS,
  PERCENTAGE_CHANGE_MAX_DECIMALS,
  PERCENTAGE_CHANGE_MIN_DECIMALS,
  TOKEN_AMOUNT_MAX_DECIMALS,
  TOKEN_AMOUNT_MIN_DECIMALS,
} from '../../constants/routing';
import {
  FooterAlert,
  FooterStepAlarm,
} from '../../containers/QuoteInfo/QuoteInfo.styles';
import { useMetaStore } from '../../store/meta';
import { QuoteErrorType, QuoteWarningType } from '../../types';
import {
  numberToString,
  secondsToString,
  totalArrivalTime,
} from '../../utils/numbers';
import { getPriceImpact, getPriceImpactLevel } from '../../utils/quote';
import { getTotalFeeInUsd } from '../../utils/swap';

import {
  Chains,
  Content,
  EXPANDABLE_QUOTE_TRANSITION_DURATION,
  FrameIcon,
  HorizontalSeparator,
  IconContainer,
  QuoteContainer,
  SummaryContainer,
} from './Quote.styles';
import { QuoteSummary } from './QuoteSummary';

export function Quote(props: QuoteProps) {
  const {
    meta: { tokens },
  } = useMetaStore();
  const {
    quote,
    input,
    output,
    error,
    warning,
    type,
    recommended = true,
  } = props;

  const [expanded, setExpanded] = useState(props.expanded);
  const quoteRef = useRef<HTMLButtonElement | null>(null);
  const totalFee = numberToString(
    getTotalFeeInUsd(quote.result?.swaps ?? [], tokens),
    GAS_FEE_MIN_DECIMALS,
    GAS_FEE_MAX_DECIMALS
  );
  const totalTime = secondsToString(totalArrivalTime(quote.result?.swaps));

  const priceImpact = getPriceImpact(input.usdValue, output.usdValue ?? null);
  const percentageChange = numberToString(
    String(priceImpact),
    PERCENTAGE_CHANGE_MIN_DECIMALS,
    PERCENTAGE_CHANGE_MAX_DECIMALS
  );
  const priceImpactWarningLevel = getPriceImpactLevel(priceImpact ?? 0);

  const getQuoteSteps = (swaps: SwapResult[]): Step[] => {
    return swaps.map((swap, index) => {
      let stepState: 'error' | 'warning' | undefined = undefined;
      const stepHasError =
        (error?.type === QuoteErrorType.BRIDGE_LIMIT &&
          error.swap.swapperId === swap.swapperId) ||
        (warning?.type === QuoteWarningType.INSUFFICIENT_SLIPPAGE &&
          warning.recommendedSlippages?.has(index));
      const stepHasWarning =
        warning?.type === QuoteWarningType.INSUFFICIENT_SLIPPAGE &&
        warning.recommendedSlippages?.has(index);

      if (stepHasError) {
        stepState = 'error';
      } else if (stepHasWarning) {
        stepState = 'warning';
      }

      return {
        swapper: { displayName: swap.swapperId, image: swap.swapperLogo },
        from: {
          token: { displayName: swap.from.symbol, image: swap.from.logo },
          chain: {
            displayName: swap.from.blockchain,
            image: swap.from.blockchainLogo,
          },
          price: {
            value:
              index === 0
                ? numberToString(
                    input.value,
                    TOKEN_AMOUNT_MIN_DECIMALS,
                    TOKEN_AMOUNT_MAX_DECIMALS
                  )
                : swap.fromAmount,
          },
        },
        to: {
          token: { displayName: swap.to.symbol, image: swap.to.logo },
          chain: {
            displayName: swap.to.blockchain,
            image: swap.to.blockchainLogo,
          },
          price: {
            value: swap.toAmount,
          },
        },
        state: stepState,
        alerts:
          stepHasError || stepHasWarning ? (
            <FooterStepAlarm>
              <Alert
                type={stepHasError ? 'error' : 'warning'}
                title={
                  error?.type === QuoteErrorType.BRIDGE_LIMIT
                    ? error?.recommendation
                    : i18n.t('Slippage Error:')
                }
                footer={
                  <FooterAlert>
                    {error?.type === QuoteErrorType.BRIDGE_LIMIT && (
                      <>
                        <Typography
                          size="xsmall"
                          variant="body"
                          color="neutral900">
                          {error.fromAmountRangeError}
                        </Typography>
                        <Divider direction="horizontal" size={8} />
                        <Typography
                          size="xsmall"
                          variant="body"
                          color="neutral900">
                          |
                        </Typography>
                        <Divider direction="horizontal" size={8} />
                        <Typography
                          size="xsmall"
                          variant="body"
                          color="neutral900">
                          {i18n.t({
                            id: 'Yours: {amount} {symbol}',
                            values: {
                              amount: numberToString(
                                swap.fromAmount,
                                TOKEN_AMOUNT_MIN_DECIMALS,
                                TOKEN_AMOUNT_MAX_DECIMALS
                              ),
                              symbol: swap?.from.symbol,
                            },
                          })}
                        </Typography>
                      </>
                    )}
                    {(error?.type === QuoteErrorType.INSUFFICIENT_SLIPPAGE ||
                      warning?.type ===
                        QuoteWarningType.INSUFFICIENT_SLIPPAGE) && (
                      <Typography
                        size="xsmall"
                        variant="body"
                        color="neutral900">
                        {i18n.t({
                          id: 'min required Slippage: {minRequiredSlippage}',
                          values: {
                            ...(error?.type ===
                              QuoteErrorType.INSUFFICIENT_SLIPPAGE && {
                              minRequiredSlippage:
                                error.recommendedSlippages?.get(index),
                            }),
                            ...(warning?.type ===
                              QuoteWarningType.INSUFFICIENT_SLIPPAGE && {
                              minRequiredSlippage:
                                warning.recommendedSlippages?.get(index),
                            }),
                          },
                        })}
                      </Typography>
                    )}
                  </FooterAlert>
                }
              />
            </FooterStepAlarm>
          ) : undefined,
      };
    });
  };
  const steps = getQuoteSteps(quote.result?.swaps ?? []);
  const numberOfSteps = steps.length;

  useLayoutEffect(() => {
    if (expanded && quoteRef.current) {
      setTimeout(() => {
        quoteRef?.current?.scrollIntoView({ behavior: 'smooth' });
      }, EXPANDABLE_QUOTE_TRANSITION_DURATION);
    }
  }, [expanded]);

  return (
    <>
      <SummaryContainer
        recommended={recommended}
        listItem={type === 'list-item'}
        basic={type === 'basic'}>
        <div className="summary">
          <QuoteCost fee={totalFee} time={totalTime} steps={numberOfSteps} />
          {type === 'basic' && (
            <div className="basic-info">
              <FrameIcon>
                <InfoIcon size={12} color="gray" />
              </FrameIcon>
              <Typography
                size="small"
                variant="body"
                style={{ letterSpacing: 0.4 }}>
                {`${input.value} ${steps[0].from.token.displayName} = ${
                  output.value
                } ${steps[steps.length - 1].to.token.displayName}`}
              </Typography>
              <Typography
                color="$neutral600"
                ml={2}
                size="xsmall"
                variant="body">
                {`($${output.usdValue})`}
              </Typography>
            </div>
          )}
          {type === 'list-item' && (
            <TokenAmount
              type="output"
              direction="vertical"
              price={{ value: output.value, usdValue: output.usdValue }}
              token={{
                displayName: steps[numberOfSteps - 1].to.token.displayName,
                image: steps[numberOfSteps - 1].to.token.image,
              }}
              chain={{ image: steps[numberOfSteps - 1].to.chain.image }}
              percentageChange={percentageChange}
              warningLevel={priceImpactWarningLevel}
            />
          )}
          {type === 'swap-preview' && (
            <>
              <QuoteSummary
                from={steps[0].from}
                to={steps[numberOfSteps - 1].to}
                percentageChange={percentageChange}
                warningLevel={priceImpactWarningLevel}
              />
              <Divider size={4} />
            </>
          )}
        </div>
        <QuoteContainer
          recommended={recommended}
          open={expanded}
          onOpenChange={setExpanded}>
          <Chains
            ref={(ref) => (quoteRef.current = ref)}
            recommended={recommended}
            onClick={setExpanded.bind(null, (prevState) => !prevState)}>
            <div>
              {steps.map((step, index) => {
                const key = `item-${index}`;
                return (
                  <React.Fragment key={key}>
                    <Tooltip
                      container={props.tooltipContainer}
                      side="bottom"
                      sideOffset={4}
                      content={step.from.chain.displayName}>
                      <Image src={step.from.chain.image} size={16} />
                    </Tooltip>
                    {index === numberOfSteps - 1 && (
                      <>
                        <IconContainer>
                          <ChevronRightIcon size={12} color="black" />
                        </IconContainer>
                        <Tooltip
                          container={props.tooltipContainer}
                          side="bottom"
                          sideOffset={4}
                          content={step.to.chain.displayName}>
                          <Image src={step.to.chain.image} size={16} />
                        </Tooltip>
                      </>
                    )}
                    {index !== numberOfSteps - 1 && (
                      <IconContainer>
                        <ChevronRightIcon size={12} color="black" />
                      </IconContainer>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <IconContainer orientation={expanded ? 'up' : 'down'}>
              <ChevronDownIcon size={12} color="black" />
            </IconContainer>
          </Chains>
          <Content open={expanded}>
            <HorizontalSeparator />
            <div className="steps-details">
              {steps.map((step, index) => {
                const key = `item-${index}`;
                return (
                  <StepDetails
                    type="quote-details"
                    key={key}
                    step={step}
                    hasSeparator={index !== steps.length - 1}
                    state={step.state}
                  />
                );
              })}
            </div>
          </Content>
        </QuoteContainer>
      </SummaryContainer>
    </>
  );
}
