import type { ChainTokenPropTypes } from './ChainToken.types.js';

import React from 'react';

import { Image } from '../common/index.js';
import { Skeleton } from '../Skeleton/index.js';

import {
  DEFAULT_TOKEN_IMAGE_SRC,
  tokenChainSizeMap,
} from './ChainToken.constants.js';
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

  const tokenImageSrc =
    tokenImage === '' ? DEFAULT_TOKEN_IMAGE_SRC : tokenImage;
  const chainImageSrc =
    chainImage === '' ? DEFAULT_TOKEN_IMAGE_SRC : chainImage;

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
        <TokenImageContainer hasBorder={!tokenImageSrc}>
          <Image
            size={tokenChainSizeMap[size].token}
            src={tokenImageSrc}
            type="circular"
            {...((useAsPlaceholder || !tokenImageSrc) && {
              useAsPlaceholder: true,
              backgroundColor: 'transparent',
            })}
          />
        </TokenImageContainer>
      )}
      <ChainImageContainer size={size} hasBorder={!chainImageSrc}>
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
            src={chainImageSrc}
            type="circular"
            {...((useAsPlaceholder || !chainImageSrc) && {
              useAsPlaceholder: true,
              backgroundColor: 'transparent',
            })}
          />
        )}
      </ChainImageContainer>
    </Container>
  );
};
