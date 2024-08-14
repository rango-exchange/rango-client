import type { PropTypes } from './Divider.types.js';

import React from 'react';

import { DividerContainer } from './Divider.styles.js';

const DEFAULT_SIZE = 12;

export function Divider({
  size = DEFAULT_SIZE,
  direction = 'vertical',
  ...props
}: PropTypes) {
  return <DividerContainer size={size} direction={direction} {...props} />;
}
