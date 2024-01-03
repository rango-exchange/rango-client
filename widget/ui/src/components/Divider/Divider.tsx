import type { PropTypes } from './Divider.types';

import React from 'react';

import { DividerContainer } from './Divider.styles';

const Default_Size = 12;

export function Divider({
  size = Default_Size,
  direction = 'vertical',
}: PropTypes) {
  return <DividerContainer size={size} direction={direction} />;
}
