import type { PropTypes } from './SwapToken.types';

import { i18n } from '@lingui/core';
import React from 'react';

import { NextIcon } from '../../icons';
import { ChainToken } from '../ChainToken';
import { Divider } from '../Divider';
import { Skeleton } from '../Skeleton';
import { Tooltip } from '../Tooltip';
import { Typography } from '../Typography';

import {
  Icon,
  IconLoading,
  Images,
  Layout,
  LayoutLoading,
  TokenContainer,
  TokenInfo,
  TopSection,
} from './SwapToken.styles';

export function SwapToken(props: PropTypes) {
  if ('isLoading' in props) {
    return (
      <TokenContainer>
        <Images>
          <div>
            <ChainToken
              tokenImage=""
              chainImage=""
              size="medium"
              loading={true}
            />
          </div>
          <div
            style={{
              transform: 'translateX(-5px)',
            }}>
            <ChainToken
              tokenImage=""
              chainImage=""
              size="medium"
              loading={true}
            />
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
            {i18n.t('Waiting for bridge transaction')}
          </Typography>
        </Layout>
      ) : (
        <Layout direction="row">
          <TokenInfo>
            <Typography size="medium" variant="title">
              {fromToken.displayName}
            </Typography>
            {!!fromAmount && (
              <Tooltip content={fromRealAmount} container={tooltipContainer}>
                <Typography size="small" variant="body" color="neutral700">
                  {fromAmount}
                </Typography>
              </Tooltip>
            )}
          </TokenInfo>
          <Icon>
            <NextIcon size={24} color="black" />
          </Icon>
          <TokenInfo>
            <Typography size="medium" variant="title">
              {toToken.displayName}
            </Typography>
            <Tooltip content={toRealAmount} container={tooltipContainer}>
              <Typography size="small" variant="body" color="neutral700">
                {toAmount}
              </Typography>
            </Tooltip>
          </TokenInfo>
        </Layout>
      )}
    </TokenContainer>
  );
}
