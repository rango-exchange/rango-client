import { darkTheme, styled } from '../../theme';

export const Chip = styled('button', {
  padding: '$10',
  borderRadius: '$sm',
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  border: 0,
  fontFamily: 'inherit',
  '.image-container': {
    borderRadius: '$xm',
    overflow: 'hidden',
  },
  '&:hover': {
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral100',
    },
    backgroundColor: '$$color',
  },
  '&:focus-visible': {
    outline: 0,
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$info700',
    },
    backgroundColor: '$$color',
  },
  variants: {
    selected: {
      true: { outline: '1px solid $secondary500' },
      false: { outline: 0 },
    },
  },
});
