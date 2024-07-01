import { darkTheme, styled } from '../../theme';

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
  variants: {
    hasWarning: {
      true: {
        '& ._typography': {
          color: '$warning500',
        },
      },
      false: {
        '& ._typography': {
          $$color: '$colors$neutral600',
          [`.${darkTheme} &`]: {
            $$color: '$colors$neutral700',
          },
          color: '$$color',
        },
      },
    },
    hasError: {
      true: {
        '& ._typography': {
          color: '$error500',
        },
      },
      false: {
        '& ._typography': {
          $$color: '$colors$neutral600',
          [`.${darkTheme} &`]: {
            $$color: '$colors$neutral700',
          },
          color: '$$color',
        },
      },
    },
  },
});
