import { styled } from '@rango-dev/ui';

export const NamespaceList = styled('ul', {
  padding: 0,
  paddingTop: '$4',
  paddingBottom: '$4',
});

// TODO: This code copied from `../HeaderButtons/HeaderButtons.styles`'s next branch. remove this and use that after syncing the PR.
export const WalletImageContainer = styled('div', {
  borderRadius: '100%',
  border: '1.5px transparent solid',
  '&:not(:first-child)': {
    marginLeft: '-$6',
  },
  img: {
    borderRadius: '100%',
  },
});
