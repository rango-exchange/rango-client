import { Button, styled } from '@rango-dev/ui';

export const Container = styled('div', {
  display: 'none',
  '@lg': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '$neutral400',
    width: '100%',
    height: '100vh',
    padding: '$20',
    flexDirection: 'row',
  },
});

export const MobileSection = styled('div', {
  display: 'flex',
  height: '100vh',
  justifyContent: 'center',
  alignItems: 'center',
  '@lg': {
    display: 'none',
  },
});

export const LeftSide = styled('div', {
  display: 'flex',
  fontFamily: '$primary',
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
  fontFamily: '$primary',
});

export const StyledButton = styled(Button, {
  width: '230px',
});

export const ResetButton = styled(StyledButton, {
  border: '1px solid $secondary500',
});

export const Content = styled('div', {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
