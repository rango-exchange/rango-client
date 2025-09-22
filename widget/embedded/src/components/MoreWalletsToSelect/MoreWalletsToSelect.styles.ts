import { styled } from '@rango-dev/ui';

export const Container = styled('div', {
  padding: '$20',
});

export const Description = styled('div', {
  paddingBottom: '$15',
  textAlign: 'center',
});

export const ListContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  columnGap: '$5',
  rowGap: '$10',
  flexWrap: 'wrap',
  height: '100%',
});
