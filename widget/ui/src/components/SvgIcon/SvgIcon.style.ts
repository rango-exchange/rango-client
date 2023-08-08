import { darkTheme, styled } from '../../theme';

export const SvgWithColor = styled('svg', {
  color: '$foreground',
  variants: {
    color: {
      primary: {
        color: '$primary',
      },
      secondary: {
        color: '$secondary',
      },
      error: {
        color: '$error',
      },
      warning: {
        color: '$warning',
      },
      success: {
        color: '$success',
      },
      black: {
        $$color: '$colors$neutral100',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral900',
        },
        stroke: '$$color',
      },
      white: {
        $$color: '$colors$neutral900',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral100',
        },
        color: '$$color',
      },
      info: {
        color: '$info',
      },
      gray: {
        color: '$neutral400',
      },
    },
  },
});
