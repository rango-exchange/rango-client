import type { PropTypes } from './SwapToken.types';

import { i18n } from '@lingui/core';
import React from 'react';

import { NextIcon } from '../../icons';
import { ChainToken } from '../ChainToken';
import { Typography } from '../Typography';

import {
  Icon,
  Images,
  Layout,
  TokenContainer,
  TokenInfo,
  TopSection,
} from './SwapToken.styles';

export function SwapToken(props: PropTypes) {
  const {
    data: {
      from: {
        token: fromToken,
        amount: fromAmount,
        blockchain: fromBlockchain,
      },
      to: {
        estimatedAmount,
        token: toToken,
        amount: toAmount,
        blockchain: toBlockchain,
      },
    },
    status,
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
            <Typography size="xsmall" variant="headline" color="neutral900">
              {fromToken.displayName}
            </Typography>
            <Icon>
              <NextIcon size={24} color="black" />
            </Icon>
            <Typography size="xsmall" variant="headline" color="neutral900">
              {toToken.displayName}
            </Typography>
          </TopSection>
          <Typography size="small" variant="body" color="neutral600">
            {i18n.t('Waiting for bridge transaction')}
          </Typography>
        </Layout>
      ) : (
        <Layout direction="row">
          <TokenInfo>
            <Typography size="xsmall" variant="headline" color="neutral900">
              {fromToken.displayName}
            </Typography>
            {!!fromAmount && (
              <Typography size="small" variant="body" color="neutral600">
                {fromAmount}
              </Typography>
            )}
          </TokenInfo>
          <Icon>
            <NextIcon size={24} color="black" />
          </Icon>
          <TokenInfo>
            <Typography size="xsmall" variant="headline" color="neutral900">
              {toToken.displayName}
            </Typography>

            <Typography size="small" variant="body" color="neutral600">
              {toAmount || estimatedAmount}
            </Typography>
          </TokenInfo>
        </Layout>
      )}
    </TokenContainer>
  );
}
