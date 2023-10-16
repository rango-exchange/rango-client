import { darkTheme, styled } from '../../theme';

export const ChipContainer = styled('button', {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '$xs',
  padding: '$5 $15',
  cursor: 'pointer',
  transition: 'all 0.35s',
  border: '1px solid transparent',
  fontFamily: 'inherit',
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',

  '&:hover': {
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral100',
    },
    backgroundColor: '$$color',
  },

  '&:focus-visible': {
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$info700',
    },
    backgroundColor: '$$color',
    outline: 0,
  },

  variants: {
    selected: {
      true: { border: '1px solid $secondary500' },
    },
  },
});
