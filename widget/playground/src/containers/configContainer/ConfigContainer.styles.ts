import { Button, darkTheme, styled } from '@rango-dev/ui';

export const Container = styled('div', {
  display: 'none',
  '@lg': {
    display: 'flex',
    justifyContent: 'center',
    $$color: '#eeeeee',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral400',
    },
    backgroundColor: '$$color',
    width: '100%',
    height: '100vh',
    padding: '$20',
    flexDirection: 'row',
  },
});

export const LeftSide = styled('div', {
  display: 'flex',
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

export const ResetButton = styled(StyledButton, {
  border: '1px solid $secondary500',
});

export const Content = styled('div', {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const MobileSection = styled('div', {
  background:
    'linear-gradient(to right bottom, $colors$info100 3%,  $neutral100 94%, $colors$info100 97%)',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  '@lg': {
    display: 'none',
  },
});

export const LogoIcon = styled('div', {
  display: 'flex',
  flexBasis: '30%',
});

export const MobileContent = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  flexBasis: '70%',
  alignItems: 'center',
  gap: '$8',
  flexDirection: 'column',
  padding: '20px',
});
