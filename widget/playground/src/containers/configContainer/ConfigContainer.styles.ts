import { Button, darkTheme, styled } from '@rango-dev/ui';

export const Layout = styled('div', {
  borderRadius: '20px',
  padding: '$15',
  backgroundColor: '$background',
  width: '338px',
  height: '100%',
  overflowY: 'auto',
  flexDirection: 'column',
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
});

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
  height: '40px',
});

export const ResetButton = styled(StyledButton, {
  border: '1px solid $secondary500',
  width: '230px',
  height: '40px',
});

export const Content = styled('div', {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
});

export const BoundaryGuide = styled('div', {
  borderStyle: 'dashed',
  borderColor: '$neutral600',
  borderRadius: '20px',
  height: '700px',
  display: 'flex',
});

export const BoundarySize = styled('div', {
  display: 'flex',
  padding: '$6 0',
  width: '100%',
  variants: {
    side: {
      left: {
        justifyContent: 'flex-start',
      },
      right: {
        justifyContent: 'flex-end',
      },
    },
  },
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

export const BoundarySection = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$15 $20',
  background: '$neutral100',
  borderRadius: '$xm',
});
