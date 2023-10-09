import { darkTheme, keyframes, styled } from '../../theme';

const waveSquares = keyframes({
  '0%': {
    backgroundPosition: '-468px 0',
  },
  '100%': {
    backgroundPosition: '468px 0',
  },
});
// #2B3462 -0.15%, rgba(43, 52, 98, 0.20) 99.85%
export const SkeletonContainer = styled('div', {
  $$background:
    'linear-gradient(90deg, $colors$info300 20%, rgba(200, 226, 255, 0.20) 70%, $colors$info300 100%)',
  [`.${darkTheme} &`]: {
    $$background:
      'linear-gradient(90deg, $colors$secondary600 0%,rgba(43, 52, 98, 0.20) 70%, $colors$secondary600 100%)',
  },
  background: '$$background',
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
        height: '$8',
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
