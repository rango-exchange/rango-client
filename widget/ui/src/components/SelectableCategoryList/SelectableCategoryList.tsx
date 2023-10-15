/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { PropTypes } from './SelectableCategoryList.types';

import { i18n } from '@lingui/core';
import React from 'react';

import { Divider, Image, Skeleton, Typography } from '..';
import { BlockchainsChip } from '../BlockchainsChip';

import { generateBlockchainsLogo } from './SelectableCategoryList.helpers';
import {
  Container,
  FirstImage,
  ImageContent,
} from './SelectableCategoryList.styles';
import { BlockchainCategories } from './SelectableCategoryList.types';

export function SelectableCategoryList(props: PropTypes) {
  const { setCategory, category, blockchains, isLoading } = props;
  const categories = Object.keys(
    BlockchainCategories
  ) as BlockchainCategories[];
  return (
    <Container>
      {isLoading &&
        Array.from(Array(5), (_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            height={70}
            width={index === 0 ? 45 : 65}
          />
        ))}
      {!isLoading &&
        categories.map((blockchainCategory) => (
          <BlockchainsChip
            selected={category === blockchainCategory}
            key={blockchainCategory}
            onClick={() => setCategory(blockchainCategory)}>
            {blockchainCategory !== BlockchainCategories.ALL && (
              <>
                <ImageContent>
                  {generateBlockchainsLogo(blockchains, blockchainCategory).map(
                    (blockchain, index) =>
                      index === 0 ? (
                        <FirstImage
                          key={`image-${blockchain.name}-${blockchain.chainId}`}
                          src={blockchain.logo}
                        />
                      ) : (
                        <Image
                          key={`image-${blockchain.name}-${blockchain.chainId}`}
                          src={blockchain.logo}
                          size={15}
                        />
                      )
                  )}
                </ImageContent>
                <Divider size={12} />
              </>
            )}
            <Typography
              size="xsmall"
              variant="body"
              color={
                blockchainCategory === BlockchainCategories.ALL
                  ? 'secondary500'
                  : undefined
              }>
              {i18n.t(BlockchainCategories[blockchainCategory])}
            </Typography>
          </BlockchainsChip>
        ))}
    </Container>
  );
}
