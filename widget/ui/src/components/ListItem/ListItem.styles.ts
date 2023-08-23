import { styled } from '../../theme';

export const BaseListItem = styled('li', {
  display: 'flex',
  alignItems: 'center',
  padding: '$10 $5',
  borderRadius: '$xs',
  '.item-start-container': {
    minWidth: '40px',
    flexShrink: 0,

    '& svg': {
      display: 'block',
    },
  },
  '.item-text-container': {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',

    '.item-text-title': {
      fontWeight: 'bold',
    },
  },
  '.item-end-container': {},
});
