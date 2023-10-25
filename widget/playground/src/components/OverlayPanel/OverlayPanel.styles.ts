import { styled } from '@rango-dev/ui';

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  height: '100%',
});
export const Header = styled('div', {
  display: 'flex',
  padding: '$5',
  alignItems: 'center',
  cursor: 'pointer',
});

export const Layout = styled('div', {
  borderRadius: '20px',
  display: 'flex',
  padding: '$15',
  backgroundColor: '$background',
  width: '338px',
  height: '100%',
  flexDirection: 'column',
  position: 'absolute',
  zIndex: 1,
  top: 0,
  left: 0,
  zIndex: '1',
});
