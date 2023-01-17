import { styled } from '../../theme';

//@ts-ignore
export const SvgWithStrokeColor = styled('svg', {
  stroke: '$textPrimary',
  variants: {
    color: {
      primary: {
        stroke: '$primary',
      },
      error: {
        stroke: '$error',
      },
      warning: {
        stroke: '$warning',
      },
      success: {
        stroke: '$success',
      },
      black: {
        stroke: '$black',
      },
      white: {
        stroke: '$white',
      },
    },
  },
});

//@ts-ignore
export const SvgWithFillColor = styled('svg', {
  fill: '$textPrimary',
  variants: {
    color: {
      primary: {
        fill: '$primary',
      },
      error: {
        fill: '$error',
      },
      warning: {
        fill: '$warning',
      },
      success: {
        fill: '$success',
      },
      black: {
        fill: '$black',
      },
      white: {
        fill: '$white',
      },
    },
  },
});
