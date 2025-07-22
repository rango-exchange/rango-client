import { Button, darkTheme, styled } from '@arlert-dev/ui';

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
    overflow: 'clip',
  },
});

export const LeftSide = styled('div', {
  display: 'flex',
});

export const Main = styled('div', {
  flexDirection: 'column',
  display: 'flex',
  width: '100%',
  overflow: 'clip',
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
  '&:disabled': {
    border: '1px solid $neutral600',
  },
});

export const Content = styled('div', {
  flex: '1 1 0%',
  overflow: 'auto',
  padding: '$10',
});

export const MobileSection = styled('div', {
  background:
    'linear-gradient(to right bottom, $secondary200 0%, $neutral100 30%, $neutral100 70%, $secondary200 100%)',

  [`.${darkTheme} &`]: {
    background:
      'linear-gradient(to right bottom, $secondary900 0%, $neutral100 30%, $neutral100 70%, $secondary900 100%)',
  },
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
