import type { PropTypes } from './SwapToken.types.js';

import { i18n } from '@lingui/core';
import React from 'react';

import { InfoIcon, NextIcon } from '../../icons/index.js';
import { ChainToken } from '../ChainToken/index.js';
import { Divider } from '../Divider/index.js';
import { Skeleton } from '../Skeleton/index.js';
import { textTruncate } from '../TokenAmount/TokenAmount.styles.js';
import { NumericTooltip, Tooltip } from '../Tooltip/index.js';
import { Typography } from '../Typography/index.js';

import {
  AmountText,
  FlexCenteredContainer,
  Icon,
  IconLoading,
  Images,
  Layout,
  LayoutLoading,
  TokenContainer,
  TokenInfo,
  TokenNameText,
  TopSection,
} from './SwapToken.styles.js';

const TOKEN_NAME_TOOLTIP_THRESHOLD = 10;
const TOKEN_AMOUNT_TOOLTIP_THRESHOLD = 6;

export function SwapToken(props: PropTypes) {
  if ('isLoading' in props) {
    return (
      <TokenContainer>
        <Images>
          <div>
            <ChainToken size="medium" loading={true} />
          </div>
          <div
            style={{
              transform: 'translateX(-5px)',
            }}>
            <ChainToken size="medium" loading={true} />
          </div>
        </Images>
        <LayoutLoading>
          <TokenInfo>
            <Skeleton variant="text" size="medium" width={76} />
            <Divider size={8} />
            <Skeleton variant="text" size="medium" width={60} />
          </TokenInfo>
          <IconLoading>
            <NextIcon size={12} color="gray" />
          </IconLoading>
          <TokenInfo>
            <Skeleton variant="text" size="medium" width={76} />
            <Divider size={8} />
            <Skeleton variant="text" size="medium" width={60} />
          </TokenInfo>
        </LayoutLoading>
      </TokenContainer>
    );
  }

  const {
    data: {
      from: {
        token: fromToken,
        amount: fromAmount,
        blockchain: fromBlockchain,
        realAmount: fromRealAmount,
      },
      to: {
        token: toToken,
        blockchain: toBlockchain,
        realAmount: toRealAmount,
      },
    },
    status,
    tooltipContainer,
    currentStep,
  } = props;

  return (
    <TokenContainer>
      <Images>
        <div>
          <ChainToken
            tokenImage={fromToken.image}
            chainImage={fromBlockchain.image}
            size="large"
          />
        </div>
        <div
          style={{
            transform: 'translateX(-10px)',
          }}>
          <ChainToken
            tokenImage={toToken.image}
            chainImage={toBlockchain.image}
            size="large"
          />
        </div>
      </Images>
      {status === 'running' ? (
        <Layout direction="column">
          <TopSection>
            <TokenNameText
              className={textTruncate()}
              size="medium"
              variant="title">
              {fromToken.displayName}
            </TokenNameText>
            {fromToken.displayName.length > TOKEN_NAME_TOOLTIP_THRESHOLD && (
              <Tooltip
                content={fromToken.displayName}
                container={tooltipContainer}>
                <InfoIcon size={12} color="gray" />
              </Tooltip>
            )}
            <Icon>
              <NextIcon size={24} color="black" />
            </Icon>
            <TokenNameText
              className={textTruncate()}
              size="medium"
              variant="title">
              {toToken.displayName}
            </TokenNameText>
            {toToken.displayName.length > TOKEN_NAME_TOOLTIP_THRESHOLD && (
              <Tooltip
                content={toToken.displayName}
                container={tooltipContainer}>
                <InfoIcon size={12} color="gray" />
              </Tooltip>
            )}
          </TopSection>
          <Typography size="small" variant="body" color="neutral700">
            {currentStep?.fromBlockchain === currentStep?.toBlockchain
              ? i18n.t('Waiting for the swap transaction')
              : i18n.t('Waiting for the bridge transaction')}
          </Typography>
        </Layout>
      ) : (
        <Layout direction="row">
          <TokenInfo>
            <FlexCenteredContainer>
              <TokenNameText
                className={textTruncate()}
                size="medium"
                variant="title">
                {fromToken.displayName}
              </TokenNameText>
              {fromToken.displayName.length > TOKEN_NAME_TOOLTIP_THRESHOLD && (
                <Tooltip
                  content={fromToken.displayName}
                  container={tooltipContainer}>
                  <InfoIcon size={12} color="gray" />
                </Tooltip>
              )}
            </FlexCenteredContainer>

            {!!fromAmount && (
              <FlexCenteredContainer>
                <AmountText
                  className={textTruncate()}
                  size="small"
                  variant="body"
                  color="neutral700">
                  {fromRealAmount}
                </AmountText>

                {fromRealAmount.length > TOKEN_AMOUNT_TOOLTIP_THRESHOLD && (
                  <NumericTooltip
                    content={fromRealAmount}
                    container={tooltipContainer}>
                    <InfoIcon size={12} color="gray" />
                  </NumericTooltip>
                )}
              </FlexCenteredContainer>
            )}
          </TokenInfo>
          <Icon>
            <NextIcon size={24} color="black" />
          </Icon>
          <TokenInfo>
            <FlexCenteredContainer>
              <TokenNameText
                className={textTruncate()}
                size="medium"
                variant="title">
                {toToken.displayName}
              </TokenNameText>
              {toToken.displayName.length > TOKEN_NAME_TOOLTIP_THRESHOLD && (
                <Tooltip
                  content={toToken.displayName}
                  container={tooltipContainer}>
                  <InfoIcon size={12} color="gray" />
                </Tooltip>
              )}
            </FlexCenteredContainer>
            <FlexCenteredContainer>
              <AmountText
                className={textTruncate()}
                size="small"
                variant="body"
                color="neutral700">
                {toRealAmount}
              </AmountText>
              {toRealAmount.length > TOKEN_AMOUNT_TOOLTIP_THRESHOLD && (
                <NumericTooltip
                  content={toRealAmount}
                  container={tooltipContainer}>
                  <InfoIcon size={12} color="gray" />
                </NumericTooltip>
              )}
            </FlexCenteredContainer>
          </TokenInfo>
        </Layout>
      )}
    </TokenContainer>
  );
}
