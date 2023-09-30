import { Button, styled } from '@rango-dev/ui';

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$neutral400',
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
  padding: '$20',
  '@lg': {
    flexDirection: 'row',
    alignItems: 'unset',
  },
});

export const LeftSide = styled('div', {
  width: '444px',
});

export const Main = styled('div', {
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  display: 'flex',
  width: '100%',
});

export const HeaderContainer = styled('div', {
  width: '100%',
  justifyContent: 'flex-end',
  alignItems: 'center',
  display: 'flex',
  padding: '$15',
});

export const StyledButton = styled(Button, {
  width: '230px',
});

export const Content = styled('div', {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
