import React from 'react';
import { styled } from '../../theme';

const SpacerContainer = styled('div', {
  variants: {
    size: {
      4: {},
      8: {},
      12: {},
      16: {},
      18: {},
      20: {},
      24: {},
    },
    direction: {
      vertical: {},
      horizontal: {},
    },
  },
  compoundVariants: [
    {
      size: 4,
      direction: 'horizontal',
      css: {
        width: '$4',
      },
    },
    {
      size: 4,
      direction: 'vertical',
      css: {
        height: '$4',
      },
    },
    {
      size: 8,
      direction: 'horizontal',
      css: {
        width: '$8',
      },
    },
    {
      size: 8,
      direction: 'vertical',
      css: {
        height: '$8',
      },
    },
    {
      size: 12,
      direction: 'horizontal',
      css: {
        width: '$12',
      },
    },
    {
      size: 12,
      direction: 'vertical',
      css: {
        height: '$12',
      },
    },
    {
      size: 16,
      direction: 'horizontal',
      css: {
        width: '$16',
      },
    },
    {
      size: 16,
      direction: 'vertical',
      css: {
        height: '$16',
      },
    },
    {
      size: 18,
      direction: 'horizontal',
      css: {
        width: '$18',
      },
    },
    {
      size: 18,
      direction: 'vertical',
      css: {
        height: '$18',
      },
    },
    {
      size: 20,
      direction: 'horizontal',
      css: {
        width: '$20',
      },
    },
    {
      size: 20,
      direction: 'vertical',
      css: {
        height: '$20',
      },
    },
    {
      size: 24,
      direction: 'horizontal',
      css: {
        width: '$24',
      },
    },
    {
      size: 24,
      direction: 'vertical',
      css: {
        height: '$24',
      },
    },
  ],
});
export interface PropTypes {
  size?: 4 | 8 | 12 | 16 | 18 | 20 | 24;
  direction?: 'vertical' | 'horizontal';
}

export function Spacer({ size = 12, direction = 'horizontal' }: PropTypes) {
  return <SpacerContainer size={size} direction={direction} />;
}
