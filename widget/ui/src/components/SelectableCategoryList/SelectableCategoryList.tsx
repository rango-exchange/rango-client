/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { SelectableCategoryListPropTypes } from './SelectableCategoryList.types.js';

import { i18n } from '@lingui/core';
import React from 'react';

import { BlockchainsChip } from '../BlockchainsChip/index.js';
import { Divider, Skeleton, Typography } from '../index.js';

import {
  blockchainCategoryIcons,
  blockchainCategoryLabel,
  hasAnyCategory,
} from './SelectableCategoryList.helpers.js';
import { Container } from './SelectableCategoryList.styles.js';
import { BlockchainCategories } from './SelectableCategoryList.types.js';

export function SelectableCategoryList(props: SelectableCategoryListPropTypes) {
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
                className={
                  'widget-selectable-category-list-blockchains-chip-btn'
                }
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
