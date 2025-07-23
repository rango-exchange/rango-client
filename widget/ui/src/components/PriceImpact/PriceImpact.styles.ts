import { darkTheme, styled } from '../../theme.js';

export const Container = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'end',
  alignItems: 'center',
});

export const ValueTypography = styled('div', {
  display: 'flex',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '& ._typography': {
    maxWidth: '71px',
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
