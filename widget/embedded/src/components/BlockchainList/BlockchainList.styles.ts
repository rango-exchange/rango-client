import { ImageContainer, styled } from '@arlert-dev/ui';

import { ScrollableArea } from '../Layout';

export const BlockchainListContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  height: '100%',
  justifyContent: 'center',
});

export const List = styled(ScrollableArea, {
  padding: 0,
  margin: 0,
  listStyle: 'none',

  [`& ${ImageContainer}`]: {
    borderRadius: '$xm',
    overflow: 'hidden',
  },
});
