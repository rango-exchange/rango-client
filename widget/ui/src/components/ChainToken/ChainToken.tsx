import type { PropTypes } from './ChainToken.types';

import React from 'react';

import { Image } from '../common';
import { Skeleton } from '../Skeleton';

import { tokenChainSizeMap } from './ChainToken.constants';
import { ChainImageContainer, Container } from './ChainToken.styles';

export const ChainToken: React.FC<PropTypes> = (props) => {
  const { tokenImage, chainImage, size, useAsPlaceholder, loading } = props;
  return (
    <Container
      css={
        loading
          ? {}
          : {
              width: tokenChainSizeMap[size].token,
              height: tokenChainSizeMap[size].token,
            }
      }>
      {loading ? (
        <Skeleton variant="circular" height={35} width={35} />
      ) : (
        <Image
          size={tokenChainSizeMap[size].token}
          src={tokenImage}
          {...(useAsPlaceholder && {
            useAsPlaceholder,
            borderRadius: '$lg',
          })}
        />
      )}
      <ChainImageContainer size={size}>
        {loading ? (
          <Skeleton variant="circular" height={16} width={16} />
        ) : (
          <Image
            size={tokenChainSizeMap[size].chain}
            src={chainImage}
            {...(useAsPlaceholder && {
              useAsPlaceholder,
              backgroundColor: '$secondary300',
              borderRadius: '$lg',
            })}
          />
        )}
      </ChainImageContainer>
    </Container>
  );
};
