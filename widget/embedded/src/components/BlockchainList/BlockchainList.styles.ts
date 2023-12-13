import { ImageContainer, styled } from '@rango-dev/ui';

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const List = styled('ul', {
  padding: 0,
  margin: 0,
  listStyle: 'none',
  overflowY: 'auto',
  paddingRight: '$5',
  [`& ${ImageContainer}`]: {
    borderRadius: '$xm',
    overflow: 'hidden',
  },
});
