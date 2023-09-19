import { darkTheme, styled } from '../../theme';

export const BaseListItemButton = styled('button', {
  transition: 'all 0.35s',
  border: 0,
  width: '100%',
  backgroundColor: 'transparent',
  '&:focus-visible': {
    borderRadius: '$xs',

    outline: 0,
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral400',
    },
    backgroundColor: '$$color',
  },
  '&:hover': {
    $$color: '$colors$info100',
    borderRadius: '$xs',

    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral400',
    },
    backgroundColor: '$$color',
    cursor: 'pointer',
  },
  '&:active': {
    transform: 'scale(0.99)',
  },
  variants: {
    hasDivider: {
      true: {
        borderBottom: '1px solid $neutral300',
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
      },
    },
    selected: {
      true: { outline: '1px solid $secondary500' },
      false: { outline: 0 },
    },
  },
});
