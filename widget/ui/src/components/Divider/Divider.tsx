import React from 'react';
import { styled } from '../../theme';

const DividerContainer = styled('div', {
  variants: {
    size: {
      4: {
        height: '$4',
      },
      8: {
        height: '$8',
      },
      12: {
        height: '$12',
      },
      16: {
        height: '$16',
      },
      18: {
        height: '$18',
      },
      20: {
        height: '$20',
      },
      24: {
        height: '$24',
      },
      32: {
        height: '$32',
      },
    },
  },
});
export interface PropTypes {
  size?: 4 | 8 | 12 | 16 | 18 | 20 | 24 | 32;
  direction?: 'vertical' | 'horizontal';
}

export function Divider({ size = 12 }: PropTypes) {
  return <DividerContainer size={size} />;
}
