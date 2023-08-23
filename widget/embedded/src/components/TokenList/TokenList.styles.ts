import { styled } from '@rango-dev/ui';

export const Title = styled('div', {
  display: 'flex',
  alignItems: 'center',
});
export const Content = styled('div', {
  minHeight: 250,
});

export const Tag = styled('div', {
  backgroundColor: '$secondary300',
  paddingLeft: '$5',
  paddingRight: '$5',
  borderRadius: '$md',
});

export const BalanceContainer = styled('div', {
  textAlign: 'right',
});
export const List = styled('ul', {
  padding: 0,
  margin: 0,
  listStyle: 'none',
});
export const End = styled('ul', {
  display: 'flex',
  alignItems: 'end',
  flexDirection: 'column',
});
