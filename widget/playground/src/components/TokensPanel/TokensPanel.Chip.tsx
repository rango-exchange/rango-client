import type { BlockchainProps } from './TokensPanel.types';

import { Typography } from '@rango-dev/ui';
import React from 'react';

import { ContainerChip } from './TokensPanel.styles';

export const BlockchainChip = (props: BlockchainProps) => {
  const { label, itemCountLabel, isSelected, onClick } = props;
  return (
    <ContainerChip
      variant={
        isSelected ? 'selected' : itemCountLabel === 0 ? 'empty' : 'regular'
      }
      onClick={onClick}>
      <Typography
        size="small"
        variant="label"
        color={
          (isSelected && 'background') ||
          (itemCountLabel === 0 && 'neutral900') ||
          'secondary500'
        }>
        {label}
      </Typography>
      {itemCountLabel !== 0 && (
        <Typography
          size="small"
          variant="label"
          color={isSelected ? 'background' : 'secondary500'}>
          {itemCountLabel}
        </Typography>
      )}
    </ContainerChip>
  );
};
