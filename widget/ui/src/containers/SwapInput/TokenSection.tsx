import type { TokenSectionProps } from './TokenSection.types.js';

import { i18n } from '@lingui/core';
import React from 'react';

import {
  ChainToken,
  Divider,
  Skeleton,
  Typography,
} from '../../components/index.js';

import {
  chainNameStyles,
  Container,
  skeletonStyles,
  tokenChainStyles,
  TokenSectionContainer,
} from './TokenSection.styles.js';

export function TokenSection(props: TokenSectionProps) {
  const {
    error,
    chainImage,
    tokenImage,
    tokenSymbol,
    chain,
    chianImageId,
    onClick,
    loading,
  } = props;
  return (
    <Container variant="default" disabled={error || loading} onClick={onClick}>
      <TokenSectionContainer>
        <ChainToken
          chianImageId={chianImageId}
          size="large"
          useAsPlaceholder={error}
          chainImage={chainImage}
          tokenImage={tokenImage}
          loading={loading}
        />
        <div className={tokenChainStyles()}>
          {loading ? (
            <div className={skeletonStyles()}>
              <Skeleton variant="text" size="large" />
              <Divider size={8} />
              <Skeleton variant="text" size="medium" />
            </div>
          ) : (
            <>
              <Typography variant="title" size="medium">
                {error || (!loading && !tokenSymbol)
                  ? i18n.t('Select Token')
                  : tokenSymbol}
              </Typography>
              <Typography
                variant="body"
                size="medium"
                className={chainNameStyles()}>
                {error || (!loading && !chain) ? i18n.t('Select Chain') : chain}
              </Typography>
            </>
          )}
        </div>
      </TokenSectionContainer>
    </Container>
  );
}
