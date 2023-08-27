import { styled } from '../../theme';

export const BaseListItem = styled('li', {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 5px',

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
    '.item-text-description': {
      color: '$neutral400',
      fontSize: '$12',
    },
  },
  '.item-end-container': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
