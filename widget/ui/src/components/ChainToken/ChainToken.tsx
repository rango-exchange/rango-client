import type { PropTypes } from './ChainToken.types';

import React from 'react';

import { Image } from '../common';

import { tokenChainSizeMap } from './ChainToken.constants';
import { ChainImageContainer, Container } from './ChainToken.styles';

export const ChainToken: React.FC<PropTypes> = (props) => {
  const { tokenImage, chainImage, size, useAsPlaceholder } = props;
  return (
    <Container
      css={{
        width: tokenChainSizeMap[size].token,
        height: tokenChainSizeMap[size].token,
      }}>
      <Image
        size={tokenChainSizeMap[size].token}
        src={tokenImage}
        {...(useAsPlaceholder && {
          useAsPlaceholder,
          borderRadius: '$lg',
        })}
      />
      <ChainImageContainer size={size}>
        <Image
          size={tokenChainSizeMap[size].chain}
          src={chainImage}
          {...(useAsPlaceholder && {
            useAsPlaceholder,
            backgroundColor: '$secondary300',
            borderRadius: '$lg',
          })}
        />
      </ChainImageContainer>
    </Container>
  );
};
