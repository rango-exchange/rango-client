import type { PropTypes } from './ChainToken.types';

import React from 'react';

import { Image } from '../common';
import { Skeleton } from '../Skeleton';

import { tokenChainSizeMap } from './ChainToken.constants';
import { ChainImageContainer, Container } from './ChainToken.styles';

export const ChainToken: React.FC<PropTypes> = (props) => {
  const {
    tokenImage,
    chainImage,
    chianImageId,
    size,
    useAsPlaceholder,
    loading,
  } = props;
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
        <Skeleton
          variant="circular"
          height={tokenChainSizeMap[size].token}
          width={tokenChainSizeMap[size].token}
        />
      ) : (
        <Image
          size={tokenChainSizeMap[size].token}
          src={tokenImage}
          type="circular"
          {...((useAsPlaceholder || !tokenImage) && { useAsPlaceholder: true })}
        />
      )}
      <ChainImageContainer size={size}>
        {loading ? (
          <Skeleton
            variant="circular"
            height={tokenChainSizeMap[size].chain}
            width={tokenChainSizeMap[size].chain}
          />
        ) : (
          <Image
            id={chianImageId}
            size={tokenChainSizeMap[size].chain}
            src={chainImage}
            type="circular"
            {...((useAsPlaceholder || !chainImage) && {
              useAsPlaceholder: true,
              backgroundColor: '$secondary300',
            })}
          />
        )}
      </ChainImageContainer>
    </Container>
  );
};
