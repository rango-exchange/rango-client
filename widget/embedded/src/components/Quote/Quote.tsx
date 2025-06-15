import type { QuoteProps } from './Quote.types';
import type { Step } from '@rango-dev/ui';
import type { SwapResult } from 'rango-sdk';

import { i18n } from '@lingui/core';
import {
  Alert,
  Divider,
  FullExpandedQuote,
  InfoIcon,
  NumericTooltip,
  QuoteTag,
  StepDetails,
  TokenAmount,
  Typography,
} from '@rango-dev/ui';
import BigNumber from 'bignumber.js';
import React, { useRef, useState } from 'react';

import {
  GAS_FEE_MAX,
  ROUTE_TIME_MAX,
  SECONDS_IN_MINUTE,
} from '../../constants/quote';
import {
  GAS_FEE_MAX_DECIMALS,
  GAS_FEE_MIN_DECIMALS,
  PERCENTAGE_CHANGE_MAX_DECIMALS,
  PERCENTAGE_CHANGE_MIN_DECIMALS,
  TOKEN_AMOUNT_MAX_DECIMALS,
  TOKEN_AMOUNT_MIN_DECIMALS,
  USD_VALUE_MAX_DECIMALS,
  USD_VALUE_MIN_DECIMALS,
  VALUE_LENGTH_THRESHOLD,
} from '../../constants/routing';
import {
  FooterAlert,
  FooterStepAlarm,
} from '../../containers/QuoteInfo/QuoteInfo.styles';
import { useAppStore } from '../../store/AppStore';
import { QuoteErrorType, QuoteWarningType } from '../../types';
import { getContainer, getExpanded } from '../../utils/common';
import {
  getBlockchainShortNameFor,
  getSwapperDisplayName,
} from '../../utils/meta';
import {
  numberToString,
  roundedSecondsToString,
  totalArrivalTime,
} from '../../utils/numbers';
import {
  getPriceImpact,
  getPriceImpactLevel,
  sortTags,
} from '../../utils/quote';
import { getTotalFeeInUsd, getUsdFeeOfStep } from '../../utils/swap';

import {
  AllRoutesButton,
  AmountText,
  BasicInfoOutput,
  basicInfoStyles,
  ContainerInfoOutput,
  Content,
  HorizontalSeparator,
  Line,
  QuoteContainer,
  stepsDetailsStyles,
  SummaryContainer,
  summaryHeaderStyles,
  summaryStyles,
  TagContainer,
  TokenNameText,
} from './Quote.styles';
import { QuoteCostDetails } from './QuoteCostDetails';
import { QuoteSummary } from './QuoteSummary';
import { QuoteTrigger } from './QuoteTrigger';

export function Quote(props: QuoteProps) {
  const {
    quote,
    input,
    output,
    error,
    warning,
    type,
    selected = false,
    tagHidden = true,
    showModalFee = true,
    onClickAllRoutes,
    fullExpandedMode = false,
    container: propContainer,
  } = props;
  const blockchains = useAppStore().blockchains();
  const { findToken } = useAppStore();
  const swappers = useAppStore().swappers();
  const { customSlippage, slippage } = useAppStore();
  const userSlippage = customSlippage || slippage;
  const [expanded, setExpanded] = useState(props.expanded);
  const quoteRef = useRef<HTMLButtonElement | null>(null);
  const roundedOutput = numberToString(
    output.value,
    TOKEN_AMOUNT_MIN_DECIMALS,
    TOKEN_AMOUNT_MAX_DECIMALS
  );
  const roundedOutputUsdValue = output.usdValue
    ? numberToString(
        output.usdValue,
        USD_VALUE_MIN_DECIMALS,
        USD_VALUE_MAX_DECIMALS
      )
    : '';
  const priceImpact = getPriceImpact(input.usdValue, output.usdValue ?? null);
  const percentageChange = numberToString(
    priceImpact,
    PERCENTAGE_CHANGE_MIN_DECIMALS,
    PERCENTAGE_CHANGE_MAX_DECIMALS
  );
  const priceImpactWarningLevel = getPriceImpactLevel(priceImpact ?? 0);

  const getQuoteSteps = (
    swaps: SwapResult[],
    internalSwap?: boolean
  ): Step[] => {
    return swaps.map((swap, index) => {
      let stepState: 'error' | 'warning' | undefined = undefined;
      const hasBridgeLimitError =
        error?.type === QuoteErrorType.BRIDGE_LIMIT &&
        error.swap.swapperId === swap.swapperId;

      const hasSlippageError =
        error?.type === QuoteErrorType.INSUFFICIENT_SLIPPAGE &&
        error.recommendedSlippages?.has(index);

      const hasSlippageWarning =
        warning?.type === QuoteWarningType.INSUFFICIENT_SLIPPAGE &&
        warning.recommendedSlippages?.has(index);

      const stepHasError = hasBridgeLimitError || hasSlippageError;
      const stepHasWarning = hasSlippageWarning;

      if (stepHasError) {
        stepState = 'error';
      } else if (stepHasWarning) {
        stepState = 'warning';
      }

      let alertTitle = stepHasError
        ? i18n.t('Slippage Error')
        : i18n.t('Slippage Warning');

      if (hasBridgeLimitError) {
        alertTitle = i18n.t('Bridge Limit Error');
      }

      return {
        swapper: {
          displayName: getSwapperDisplayName(swap.swapperId, swappers) ?? '',
          image: swap.swapperLogo,
        },
        from: {
          token: { displayName: swap.from.symbol, image: swap.from.logo },
          chain: {
            displayName:
              getBlockchainShortNameFor(swap.from.blockchain, blockchains) ??
              '',
            image: swap.from.blockchainLogo,
          },
          price: {
            value:
              index === 0 && !internalSwap
                ? numberToString(
                    input.value,
                    TOKEN_AMOUNT_MIN_DECIMALS,
                    TOKEN_AMOUNT_MAX_DECIMALS
                  )
                : numberToString(
                    swap.fromAmount,
                    TOKEN_AMOUNT_MIN_DECIMALS,
                    TOKEN_AMOUNT_MAX_DECIMALS
                  ),
            usdValue: numberToString(
              (swap.from.usdPrice ?? 0) * parseFloat(swap.fromAmount),
              USD_VALUE_MIN_DECIMALS,
              USD_VALUE_MAX_DECIMALS
            ),
            realValue: index === 0 ? input.value : swap.fromAmount,
            realUsdValue: new BigNumber(swap.from.usdPrice ?? 0)
              .multipliedBy(swap.fromAmount)
              .toString(),
          },
        },
        to: {
          token: { displayName: swap.to.symbol, image: swap.to.logo },
          chain: {
            displayName:
              getBlockchainShortNameFor(swap.to.blockchain, blockchains) || '',
            image: swap.to.blockchainLogo,
          },
          price: {
            value: numberToString(
              swap.toAmount,
              TOKEN_AMOUNT_MIN_DECIMALS,
              TOKEN_AMOUNT_MAX_DECIMALS
            ),
            usdValue: numberToString(
              (swap.to.usdPrice ?? 0) * parseFloat(swap.toAmount),
              USD_VALUE_MIN_DECIMALS,
              USD_VALUE_MAX_DECIMALS
            ),
            realValue: swap.toAmount,
            realUsdValue: new BigNumber(swap.to.usdPrice ?? 0)
              .multipliedBy(swap.toAmount)
              .toString(),
          },
        },
        state: stepState,
        alerts:
          stepHasError || stepHasWarning ? (
            <FooterStepAlarm dense={fullExpandedMode}>
              <Alert
                variant="alarm"
                type={stepHasError ? 'error' : 'warning'}
                title={alertTitle}
                id="widget-quote-footer-step-alarm-alert"
                footer={
                  <FooterAlert>
                    {hasBridgeLimitError && (
                      <div>
                        <Typography
                          size="xsmall"
                          variant="body"
                          color="neutral900">
                          {error.fromAmountRangeError}
                        </Typography>
                        <Divider direction="vertical" size={2} />
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
                      </div>
                    )}
                    {(hasSlippageError || hasSlippageWarning) &&
                      !hasBridgeLimitError && (
                        <div>
                          <Typography
                            size="xsmall"
                            variant="body"
                            color="neutral900">
                            {i18n.t({
                              id: 'Minimum suggested slippage: {minRequiredSlippage}',
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
                          <Divider direction="vertical" size={2} />
                          <Typography
                            size="xsmall"
                            variant="body"
                            color="neutral900">
                            {i18n.t({
                              id: 'Yours: {userSlippage}',
                              values: {
                                userSlippage,
                              },
                            })}
                          </Typography>
                        </div>
                      )}
                  </FooterAlert>
                }
              />
            </FooterStepAlarm>
          ) : undefined,
        time: roundedSecondsToString(swap.estimatedTimeInSeconds),
        fee: numberToString(
          getUsdFeeOfStep(swap, findToken),
          GAS_FEE_MIN_DECIMALS,
          GAS_FEE_MAX_DECIMALS
        ),
        internalSwaps: swap.internalSwaps
          ? getQuoteSteps(swap.internalSwaps)
          : undefined,
      };
    });
  };
  const steps = getQuoteSteps(quote?.swaps ?? []);

  const numberOfSteps = steps.length;
  const container = propContainer || getContainer();
  const sortedQuoteTags = sortTags(props.quote.tags || []);
  const showAllRoutesButton = !!onClickAllRoutes;
  const totalDurationSeconds = totalArrivalTime(quote?.swaps);
  const totalTime = roundedSecondsToString(totalDurationSeconds);
  const totalFee = getTotalFeeInUsd(quote?.swaps ?? [], findToken);
  const fee = numberToString(
    totalFee,
    GAS_FEE_MIN_DECIMALS,
    GAS_FEE_MAX_DECIMALS
  );

  const feeWarning = totalFee.gte(new BigNumber(GAS_FEE_MAX));
  const timeWarning =
    totalDurationSeconds / SECONDS_IN_MINUTE >= ROUTE_TIME_MAX;

  return fullExpandedMode ? (
    <FullExpandedQuote
      selected={selected}
      fee={fee}
      time={totalTime}
      tooltipContainer={getExpanded()}
      steps={steps}
      tags={sortedQuoteTags}
      id="widget-quote-full-expanded-quote-container"
      quoteCost={
        <QuoteCostDetails
          quote={quote}
          fullExpandedMode
          time={totalTime}
          fee={totalFee}
          feeWarning={feeWarning}
          timeWarning={timeWarning}
          showModalFee={showModalFee}
          steps={numberOfSteps}
        />
      }
      percentageChange={percentageChange}
      warningLevel={priceImpactWarningLevel}
      outputPrice={{
        value: roundedOutput,
        usdValue: roundedOutputUsdValue,
        realValue: output.value,
        realUsdValue: output.usdValue,
      }}
    />
  ) : (
    <SummaryContainer
      id="widget-quote-summary-container"
      selected={selected}
      listItem={type === 'list-item'}
      basic={type === 'basic'}>
      <div className={summaryStyles()}>
        {!tagHidden && sortedQuoteTags.length ? (
          <>
            <TagContainer>
              {sortedQuoteTags.map((tag, index) => {
                const key = `${tag.value}_${index}`;
                return (
                  <React.Fragment key={key}>
                    <QuoteTag label={tag.label} value={tag.value} />
                    <Divider size={4} direction="horizontal" />
                  </React.Fragment>
                );
              })}
            </TagContainer>
            <Line />
            {!showAllRoutesButton && <Divider size={4} />}
          </>
        ) : null}
        <div id="portal-root" className={summaryHeaderStyles()}>
          <QuoteCostDetails
            quote={quote}
            time={totalTime}
            fee={totalFee}
            feeWarning={feeWarning}
            timeWarning={timeWarning}
            showModalFee={showModalFee}
            steps={numberOfSteps}
          />

          {showAllRoutesButton && (
            <AllRoutesButton
              onClick={(e) => {
                e.stopPropagation();
                onClickAllRoutes();
              }}
              id="widget-quote-all-routes-btn"
              size="xxsmall"
              type="secondary"
              variant="default"
              css={{
                paddingLeft: '$10',
                paddingRight: '$10',
                paddingTop: '$5',
                paddingBottom: '$5',
              }}>
              <Typography
                color="secondary"
                variant="body"
                size="xsmall"
                className="allRoutesLabel">
                {i18n.t('See All Routes')}
              </Typography>
            </AllRoutesButton>
          )}
        </div>
        {type === 'basic' && (
          <div className={basicInfoStyles()}>
            <ContainerInfoOutput>
              <BasicInfoOutput>
                <AmountText size="small" variant="body">
                  {input.value}
                </AmountText>
                {input.value.length > VALUE_LENGTH_THRESHOLD && (
                  <NumericTooltip
                    content={input.value}
                    container={container}
                    open={!input.value ? false : undefined}>
                    <InfoIcon size={12} color="gray" />
                  </NumericTooltip>
                )}
                <TokenNameText size="small" variant="body">
                  {steps[0].from.token.displayName}
                </TokenNameText>
                <Typography size="small" variant="body">
                  =
                </Typography>
                <AmountText size="small" variant="body">
                  {output.value}
                </AmountText>
                {output.value.length > VALUE_LENGTH_THRESHOLD && (
                  <NumericTooltip
                    content={output.value}
                    container={container}
                    open={!output.value ? false : undefined}>
                    <InfoIcon size={12} color="gray" />
                  </NumericTooltip>
                )}
                <TokenNameText size="small" variant="body">
                  {steps[steps.length - 1].to.token.displayName}
                </TokenNameText>
              </BasicInfoOutput>
            </ContainerInfoOutput>
            <NumericTooltip content={output.usdValue} container={container}>
              <Divider size={2} direction="horizontal" />
              <Typography color="$neutral600" size="xsmall" variant="body">
                {`($${roundedOutputUsdValue})`}
              </Typography>
            </NumericTooltip>
          </div>
        )}
        {type === 'list-item' && (
          <TokenAmount
            id="widget-quote-token-amount-container"
            tooltipContainer={container}
            type="output"
            direction="vertical"
            price={{
              value: roundedOutput,
              usdValue: roundedOutputUsdValue,
              realValue: output.value,
              realUsdValue: output.usdValue,
            }}
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
        selected={selected}
        listItem={type === 'list-item'}
        open={expanded}
        className="quote_container"
        onOpenChange={setExpanded}>
        <QuoteTrigger
          type={type}
          quoteRef={quoteRef}
          selected={selected}
          setExpanded={setExpanded}
          container={container}
          expanded={expanded}
          steps={steps}
        />
        <Content open={expanded}>
          <HorizontalSeparator />
          <div className={stepsDetailsStyles()}>
            {steps.map((step, index) => {
              const key = `item-${index}`;
              return (
                <StepDetails
                  type="quote-details"
                  className="widget-quote-step-details-container"
                  key={key}
                  tooltipContainer={container}
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
  );
}
