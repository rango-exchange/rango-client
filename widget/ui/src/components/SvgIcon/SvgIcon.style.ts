import { styled } from '../../theme';

export const SvgWithColor = styled('svg', {
  variants: {
    color: {
      primary: {
        color: '$primary500',
      },
      secondary: {
        color: '$secondary500',
      },
      error: {
        color: '$error500',
      },
      warning: {
        color: '$warning500',
      },
      success: {
        color: '$success500',
      },
      black: {
        color: '$foreground',
      },
      white: {
        color: '$background',
      },
      info: {
        color: '$info500',
      },
      gray: {
        color: '$neutral700',
      },
    },
  },
});
