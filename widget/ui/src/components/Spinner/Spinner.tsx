import type { SvgIconProps } from '../SvgIcon';
import type * as Stitches from '@stitches/react';

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
  size?: 12 | 16 | 20 | 24 | 30;
  color?: SvgIconProps['color'];
  css?: Stitches.CSS;
}

export function Spinner(props: PropTypes) {
  const { size, color, css = {} } = props;
  return (
    <SpinnerContainer css={css}>
      <LoadingIcon size={size} color={color} />
    </SpinnerContainer>
  );
}
