import { keyframes, styled } from '../../theme';

export const AnimationRefresh = keyframes({
  '0%': {
    strokeDashoffset: '0',
  },
  '100%': {
    strokeDashoffset: '-30',
  },
});

export const StyledCircle = styled('circle', {
  variants: {
    color: {
      primary: {
        stroke: '$primary500',
      },
      secondary: {
        stroke: '$secondary500',
      },
      error: {
        stroke: '$error500',
      },
      warning: {
        stroke: '$warning500',
      },
      success: {
        stroke: '$success500',
      },
      black: {
        stroke: '$foreground',
      },
      white: {
        stroke: '$background',
      },
      info: {
        stroke: '$info500',
      },
      gray: {
        stroke: '$neutral700',
      },
    },
  },
});

export const StyledPath = styled('path', {
  fill: '$info500',
});
