import { styled } from '../../theme';

export const BaseListItem = styled('li', {
  display: 'flex',
  alignItems: 'center',
  padding: '$10 $5',
  borderRadius: '$xs',
  '.item-start-container': {
    paddingRight: '$10',
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
      display: 'flex',
      alignItems: 'center',
    },
  },
  '.item-end-container': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '$10',
  },
});
