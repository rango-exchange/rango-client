import { darkTheme, styled } from '../../theme';

export const SvgWithStrokeColor = styled('svg', {
  stroke: '$foreground',
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
        $$color: '$colors$foreground',
        [`.${darkTheme} &`]: {
          $$color: '$colors$background',
        },
        stroke: '$$color',
      },
      white: {
        $$color: '$colors$background',
        [`.${darkTheme} &`]: {
          $$color: '$colors$foreground',
        },
        stroke: '$$color',
      },
    },
    disabled: {
      true: {
        stroke: '$neutral400',
      },
    },
  },
});

export const SvgWithFillColor = styled('svg', {
  fill: '$foreground',
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
        $$color: '$colors$foreground',
        [`.${darkTheme} &`]: {
          $$color: '$colors$background',
        },
        fill: '$$color',
      },
      white: {
        $$color: '$colors$background',
        [`.${darkTheme} &`]: {
          $$color: '$colors$foreground',
        },
        fill: '$$color',
      },
    },
    disabled: {
      true: {
        stroke: '$neutral400',
      },
    },
  },
});
