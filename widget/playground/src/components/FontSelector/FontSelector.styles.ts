import { Button, styled } from '@rango-dev/ui';

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

export const FontList = styled('div', {
  display: 'flex',
  padding: '$10 $5',
  flexDirection: 'column',
});

export const StyledButton = styled(Button, {
  position: 'absolute',
  bottom: 10,
  width: '100%',
});
