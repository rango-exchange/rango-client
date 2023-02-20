import React from 'react';
import { styled } from '../../theme';

const SpacerContainer = styled('div', {
  variants: {
    size: {
      12: {
        width: '$12',
      },
      16: {
        width: '$16',
      },
      18: {
        width: '$18',
      },
      20: {
        width: '$20',
      },
    },
  },
});
export interface PropTypes {
  size?: 12 | 16 | 18 | 20;
}

export function Spacer({ size = 12 }: PropTypes) {
  return <SpacerContainer size={size} />;
}
