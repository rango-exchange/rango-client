import type { TokenSectionProps } from './TokenSection.types';

import { i18n } from '@lingui/core';
import React from 'react';

import { ChainToken, Divider, Skeleton, Typography } from '../../components';

import { Container, TokenSectionContainer } from './TokenSection.styles';

export function TokenSection(props: TokenSectionProps) {
  const {
    error,
    chainImage,
    tokenImage,
    tokenSymbol,
    chain,
    onClick,
    loading,
  } = props;
  return (
    <Container variant="default" disabled={error || loading} onClick={onClick}>
      <TokenSectionContainer>
        <ChainToken
          size="large"
          useAsPlaceholder={error}
          chainImage={chainImage}
          tokenImage={tokenImage}
          loading={loading}
        />
        <div className="token-chain-name">
          {loading ? (
            <div className="token-chain-name__skeleton">
              <Skeleton variant="text" size="large" width={92} />
              <Divider size={8} />
              <Skeleton variant="text" size="medium" width={92} />
            </div>
          ) : (
            <>
              <Typography variant="title" size="medium">
                {error || (!loading && !tokenSymbol)
                  ? i18n.t('Token')
                  : tokenSymbol}
              </Typography>
              <Typography variant="body" size="medium" color="$neutral600">
                {error || (!loading && !chain) ? i18n.t('Chain') : chain}
              </Typography>
            </>
          )}
        </div>
      </TokenSectionContainer>
    </Container>
  );
}
