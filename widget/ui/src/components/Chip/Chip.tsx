import type { PropTypes } from './Chip.types';

import React from 'react';

import { Typography } from '../Typography';

import { ChipContainer } from './Chip.styles';

export function Chip(props: PropTypes) {
  const { label, selected, prefix, suffix, ...otherProps } = props;
  return (
    <ChipContainer selected={selected} {...otherProps}>
      {prefix || null}
      <Typography
        color={selected ? 'neutral900' : 'neutral600'}
        variant="body"
        size="medium">
        {label}
      </Typography>
      {suffix || null}
    </ChipContainer>
  );
}
