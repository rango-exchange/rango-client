import { darkTheme, styled } from '../../theme.js';

export const Container = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'end',
  alignItems: 'center',
  overflow: 'hidden',
  minWidth: 0,
});

export const ValueTypography = styled('div', {
  display: 'flex',
  '& .output-usd-value': {
    flex: '1 1 auto',
    minWidth: 0,
    flexShrink: 1,
    maxWidth: '100%',
  },
  '& ._typography': {
    $$color: '$colors$neutral600',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral700',
    },
    color: '$$color',
  },
  variants: {
    hasWarning: {
      true: {
        '& ._typography': {
          color: '$warning500',
        },
      },
    },
    hasError: {
      true: {
        '& ._typography': {
          color: '$error500',
        },
      },
    },
  },
});
