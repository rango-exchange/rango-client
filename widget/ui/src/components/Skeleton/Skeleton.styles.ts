import { keyframes, styled } from '../../theme';

const waveSquares = keyframes({
  '0%': {
    backgroundPosition: '-468px 0',
  },
  '100%': {
    backgroundPosition: '468px 0',
  },
});

export const SkeletonContainer = styled('div', {
  background: `linear-gradient(90deg, rgb(225, 222, 232) 0%, rgb(242, 239, 249) 50%, rgb(225, 222, 232) 100%)`,
  backgroundSize: '800px 100px',
  animation: `${waveSquares} 2s infinite ease-out`,
  variants: {
    variant: {
      text: {
        borderRadius: '$sm',
      },
      circular: {
        borderRadius: '$lg',
      },
      rectangular: {},
      rounded: {
        borderRadius: '$sm',
      },
    },

    size: {
      small: {},
      medium: {},
      large: {},
    },
  },

  compoundVariants: [
    {
      size: 'small',
      variant: 'text',
      css: {
        height: '$10',
      },
    },
    {
      size: 'medium',
      variant: 'text',
      css: {
        height: '$12',
      },
    },
    {
      size: 'large',
      variant: 'text',
      css: {
        height: '$16',
      },
    },
  ],
});
