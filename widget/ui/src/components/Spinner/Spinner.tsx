import type { SvgIconProps } from '../SvgIcon';

import React from 'react';

import { LoadingIcon } from '../../icons';
import { keyframes, styled } from '../../theme';

const spin = keyframes({
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const SpinnerContainer = styled('div', {
  position: 'relative',
  animation: `${spin} 1.5s linear infinite`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export interface PropTypes {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  size?: 16 | 20 | 24;
  color?: SvgIconProps['color'];
}

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export function Spinner({ size, color }: PropTypes) {
  return (
    <SpinnerContainer>
      <LoadingIcon size={size} color={color} />
    </SpinnerContainer>
  );
}
