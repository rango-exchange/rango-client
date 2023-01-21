import React from 'react';
import { keyframes, styled } from '../../theme';

const waveSquares = keyframes({
  '0%': {
    backgroundPosition: '-468px 0',
  },
  '100%': {
    backgroundPosition: '468px 0',
  },
});

const SkeletonContainer = styled('div', {
  borderRadius: '$5',
  backgroundColor: '$neutrals300',
  background: `linear-gradient(to right, rgba(130, 130, 130, 0.2) 8%, rgba(130, 130, 130, 0.3) 18%, rgba(130, 130, 130, 0.2) 33%)`,
  backgroundSize: '800px 100px',
  animation: `${waveSquares} 2s infinite ease-out`,
  variants: {
    width: {
      16: {
        width: '$16',
      },
      20: {
        width: '$20',
      },
      24: {
        width: '$24',
      },
      36: {
        width: '$36',
      },
      48: {
        width: '$48',
      },
    },
    height: {
      16: {
        height: '$16',
      },
      20: {
        height: '$20',
      },
      24: {
        height: '$24',
      },
      36: {
        height: '$36',
      },
      48: {
        height: '$48',
      },
    },
  },
});
export interface PropTypes {
  width?: 20 | 24 | 36 | 48;
  height?: 20 | 24 | 36 | 48;
}

function Skeleton({ width = 20, height = 20 }: PropTypes) {
  return <SkeletonContainer width={width} height={height} />;
}

export default Skeleton;
