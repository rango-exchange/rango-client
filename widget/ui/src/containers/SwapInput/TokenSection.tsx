import type { TokenSectionProps } from './TokenSection.types';

import { i18n } from '@lingui/core';
import { styled } from '@stitches/react';
import React from 'react';

import {
  Button,
  ChainToken,
  Divider,
  Skeleton,
  Typography,
} from '../../components';

import { TokenSectionContainer } from './TokenSection.styles';

const Container = styled(Button, {
  '&:hover': {
    borderRadius: '$xs',
    backgroundColor: '$info100',
  },
});

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
    <Container variant="ghost" disabled={error || loading} onClick={onClick}>
      <TokenSectionContainer loading={loading}>
        <ChainToken
          size="large"
          useAsPlaceholder={error || (!loading && (!chainImage || !tokenImage))}
          chainImage={chainImage}
          tokenImage={tokenImage}
          loading={loading}
        />
        <div className="token-chain-name">
          {loading ? (
            <>
              <Skeleton variant="text" size="large" width={92} />
              <Divider size={4} />
              <Skeleton variant="text" size="medium" width={92} />
            </>
          ) : (
            <>
              <Typography variant="title" size="medium">
                {error || (!loading && !tokenSymbol)
                  ? i18n.t('Token')
                  : tokenSymbol}
              </Typography>
              <Typography variant="body" size="medium" color="$neutral800">
                {error || (!loading && !chain) ? i18n.t('Chain') : chain}
              </Typography>
            </>
          )}
        </div>
      </TokenSectionContainer>
    </Container>
  );
}
