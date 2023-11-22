/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { PropTypes } from './SelectableCategoryList.types';

import { i18n } from '@lingui/core';
import React from 'react';

import { Divider, Skeleton, Typography } from '..';
import { BlockchainsChip } from '../BlockchainsChip';

import {
  blockchainCategoryIcons,
  blockchainCategoryLabel,
  hasAnyCategory,
} from './SelectableCategoryList.helpers';
import { Container } from './SelectableCategoryList.styles';
import { BlockchainCategories } from './SelectableCategoryList.types';

export function SelectableCategoryList(props: PropTypes) {
  const { setCategory, category, isLoading, blockchains } = props;
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
        categories.map((blockchainCategory) => {
          const Logo =
            blockchainCategory !== BlockchainCategories.ALL
              ? blockchainCategoryIcons[blockchainCategory]
              : null;

          const hasBlockchain = hasAnyCategory(blockchains, blockchainCategory);

          return (
            hasBlockchain && (
              <BlockchainsChip
                selected={category === blockchainCategory}
                key={blockchainCategory}
                onClick={() => setCategory(blockchainCategory)}>
                {Logo && (
                  <>
                    <Logo size={28} />
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
                  {i18n.t({
                    id: '{blockchainCategory}',
                    values: {
                      blockchainCategory:
                        blockchainCategoryLabel[blockchainCategory],
                    },
                  })}
                </Typography>
              </BlockchainsChip>
            )
          );
        })}
    </Container>
  );
}
