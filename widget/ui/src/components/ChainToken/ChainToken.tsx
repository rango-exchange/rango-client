import type { ChainTokenPropTypes } from './ChainToken.types.js';

import React from 'react';

import { Image } from '../common/index.js';
import { Skeleton } from '../Skeleton/index.js';

import { tokenChainSizeMap } from './ChainToken.constants.js';
import {
  ChainImageContainer,
  Container,
  TokenImageContainer,
} from './ChainToken.styles.js';

export const ChainToken: React.FC<ChainTokenPropTypes> = (props) => {
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
        <TokenImageContainer hasBorder={!tokenImage}>
          <Image
            size={tokenChainSizeMap[size].token}
            src={tokenImage}
            type="circular"
            {...((useAsPlaceholder || !tokenImage) && {
              useAsPlaceholder: true,
              backgroundColor: 'transparent',
            })}
          />
        </TokenImageContainer>
      )}
      <ChainImageContainer size={size} hasBorder={!chainImage}>
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
              backgroundColor: 'transparent',
            })}
          />
        )}
      </ChainImageContainer>
    </Container>
  );
};
