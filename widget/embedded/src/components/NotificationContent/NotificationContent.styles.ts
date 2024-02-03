import { styled } from '@rango-dev/ui';

export const Container = styled('div', {
  padding: '$10',
  width: '350px',
  maxWidth: '90vw',
  minHeight: '150px',
});

export const List = styled('ul', {
  padding: 0,
  margin: 0,
  listStyle: 'none',

  '.to-chain-token': {
    transform: 'translateX(-3px)',
  },
});

export const Images = styled('div', {
  display: 'flex',
  padding: 0,
  alignItems: 'center',
  alignSelf: 'stretch',
});

export const NotFoundContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  padding: '$10',
  width: '100%',
  height: '150px',
});
