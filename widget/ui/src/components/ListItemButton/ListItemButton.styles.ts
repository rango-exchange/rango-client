import { darkTheme, styled } from '../../theme';
import { ListItem } from '../ListItem';

export const BaseListItemButton = styled(ListItem, {
  transition: 'all 0.35s',
  '&:hover': {
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral400',
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
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral400',
    },
    backgroundColor: '$$color',
  },
});
