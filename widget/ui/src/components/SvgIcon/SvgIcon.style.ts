import { darkTheme, styled } from '../../theme';

export const SvgWithColor = styled('svg', {
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
        $$color: '$colors$neutral700',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral100',
        },
        color: '$$color',
      },
      white: {
        $$color: '$colors$neutral100',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral700',
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
