import type { PropTypes } from './Chip.types';

import React from 'react';

import { Typography } from '../Typography';

import { ChipCointainer } from './Chip.styles';

export function Chip(props: PropTypes) {
  const { label, selected, prefix, suffix, onClick, style } = props;
  return (
    <ChipCointainer selected={selected} onClick={onClick} style={style}>
      {prefix || null}
      <Typography
        color={selected ? 'neutral900' : 'neutral600'}
        variant="body"
        size="medium">
        {label}
      </Typography>
      {suffix || null}
    </ChipCointainer>
  );
}
