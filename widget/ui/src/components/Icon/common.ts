import { styled } from '../../theme';

export const SvgWithStrokeColor = styled('svg', {
  stroke: '$neutral100',
  width: '$24',
  height: '$24',
  variants: {
    color: {
      primary: {
        stroke: '$primary',
      },
      secondary: {
        stroke: '$secondary',
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
      info: {
        stroke: '$info',
      },

      black: {
        stroke: '$neutral900',
      },
      white: {
        stroke: '$neutral100',
      },
      gray: {
        stroke: '$neutral400',
      },
    },
    size: {
      12: {
        width: '$12',
        height: '$12',
      },
      16: {
        width: '$16',
        height: '$16',
      },
      18: {
        width: '$18',
        height: '$18',
      },
      20: {
        width: '$20',
        height: '$20',
      },
      24: {
        width: '$24',
        height: '$24',
      },
      28: {
        width: '$28',
        height: '$28',
      },
      32: {
        width: '$32',
        height: '$32',
      },
      36: {
        width: '$36',
        height: '$36',
      },
      40: {
        width: '$40',
        height: '$40',
      },
    },
  },
});

export const SvgWithFillColor = styled('svg', {
  fill: '$neutral100',
  width: '$24',
  height: '$24',
  variants: {
    color: {
      primary: {
        fill: '$primary',
      },
      secondary: {
        fill: '$secondary',
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
        fill: '$neutral900',
      },
      white: {
        fill: '$neutral100',
      },
      info: {
        fill: '$info',
      },
      gray: {
        fill: '$neutral400',
      },
    },
    size: {
      12: {
        width: '$12',
        height: '$12',
      },
      16: {
        width: '$16',
        height: '$16',
      },
      18: {
        width: '$18',
        height: '$18',
      },
      20: {
        width: '$20',
        height: '$20',
      },
      24: {
        width: '$24',
        height: '$24',
      },
      28: {
        width: '$28',
        height: '$28',
      },
      32: {
        width: '$32',
        height: '$32',
      },
      36: {
        width: '$36',
        height: '$36',
      },
      40: {
        width: '$40',
        height: '$40',
      },
    },
  },
});

export const selectColor = (
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'success'
    | 'black'
    | 'white'
    | 'gray'
    | 'info'
) => {
  switch (color) {
    case 'primary':
      return '$primary';
    case 'secondary':
      return '$secondary';
    case 'warning':
      return '$warning';
    case 'error':
      return '$error';
    case 'success':
      return '$success';
    case 'black':
      return '$neutral900';
    case 'white':
      return '$neutral100';
    case 'gray':
      return '$neutral400';
    case 'info':
      return '$info';
    default:
      return '$neutral100';
  }
};
