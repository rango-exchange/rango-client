import type { PropTypes } from './SwapToken.types.js';

import { i18n } from '@lingui/core';
import React from 'react';

import { NextIcon } from '../../icons/index.js';
import { ChainToken } from '../ChainToken/index.js';
import { Divider } from '../Divider/index.js';
import { Skeleton } from '../Skeleton/index.js';
import { NumericTooltip } from '../Tooltip/index.js';
import { Typography } from '../Typography/index.js';

import {
  Icon,
  IconLoading,
  Images,
  Layout,
  LayoutLoading,
  TokenContainer,
  TokenInfo,
  TopSection,
} from './SwapToken.styles.js';

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
        amount: toAmount,
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
            <Typography size="medium" variant="title">
              {fromToken.displayName}
            </Typography>
            <Icon>
              <NextIcon size={24} color="black" />
            </Icon>
            <Typography size="medium" variant="title">
              {toToken.displayName}
            </Typography>
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
            <Typography size="medium" variant="title">
              {fromToken.displayName}
            </Typography>
            {!!fromAmount && (
              <NumericTooltip
                content={fromRealAmount}
                container={tooltipContainer}>
                <Typography size="small" variant="body" color="neutral700">
                  {fromAmount}
                </Typography>
              </NumericTooltip>
            )}
          </TokenInfo>
          <Icon>
            <NextIcon size={24} color="black" />
          </Icon>
          <TokenInfo>
            <Typography size="medium" variant="title">
              {toToken.displayName}
            </Typography>
            <NumericTooltip content={toRealAmount} container={tooltipContainer}>
              <Typography size="small" variant="body" color="neutral700">
                {toAmount}
              </Typography>
            </NumericTooltip>
          </TokenInfo>
        </Layout>
      )}
    </TokenContainer>
  );
}
