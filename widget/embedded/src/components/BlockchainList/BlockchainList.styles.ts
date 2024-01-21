import { ImageContainer, styled } from '@rango-dev/ui';

import { ScrollableArea } from '../Layout';

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
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
