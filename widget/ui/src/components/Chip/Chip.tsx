import type { ChipPropTypes } from './Chip.types.js';

import React from 'react';

import { Typography } from '../Typography/index.js';

import { ChipContainer } from './Chip.styles.js';

export function Chip(props: ChipPropTypes) {
  const { label, selected, prefix, suffix, ...otherProps } = props;
  return (
    <ChipContainer selected={selected} {...otherProps}>
      {prefix || null}
      <Typography
        color={!selected ? 'neutral700' : undefined}
        variant="body"
        size="medium">
        {label}
      </Typography>
      {suffix || null}
    </ChipContainer>
  );
}
