import type { TokenSectionProps } from './TokenSection.types';

import React from 'react';

import { Button, ChainToken, Typography } from '../../components';

import { TokenSectionContainer } from './TokenSection.styles';

export function TokenSection(props: TokenSectionProps) {
  const { error, chainImage, tokenImage, tokenSymbol, chain, onClick } = props;
  return (
    <Button
      variant="ghost"
      style={{ padding: 0 }}
      disabled={error}
      onClick={onClick}>
      <TokenSectionContainer>
        <ChainToken
          size="large"
          useAsPlaceholder={error}
          chainImage={chainImage}
          tokenImage={tokenImage}
        />
        <div className="token-chain-name">
          <Typography variant="title" size="medium">
            {error ? 'Token' : tokenSymbol}
          </Typography>
          <Typography variant="body" size="medium" color="$neutral400">
            {error ? 'Chain' : chain}
          </Typography>
        </div>
      </TokenSectionContainer>
    </Button>
  );
}
