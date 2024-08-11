import { darkTheme, styled } from '../../theme';
import { ListItem } from '../ListItem/ListItem';

export const BaseListItemButton = styled(ListItem, {
  transition: 'all 0.35s',
  '&:hover': {
    borderRadius: '$xs',
    $$color: '$colors$secondary100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral100',
    },
    backgroundColor: '$$color',
    cursor: 'pointer',
  },
  '&:active': {
    transform: 'scale(0.99)',
  },

  '&:focus-visible': {
    borderRadius: '$xs',

    outline: 0,
    $$color: '$colors$secondary100',
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
