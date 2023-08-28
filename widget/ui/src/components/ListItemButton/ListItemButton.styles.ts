import { styled } from '../../theme';
import { ListItem } from '../ListItem';

export const BaseListItemButton = styled(ListItem, {
  transition: 'all 0.35s',
  '&:hover': {
    backgroundColor: '$neutral200',
    cursor: 'pointer',
  },
  '&:active': {
    transform: 'scale(0.99)',
  },
});
