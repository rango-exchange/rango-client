import { Button, styled } from '@rango-dev/ui';

export const Container = styled('div', {
  position: 'relative',
});

export const Color = styled('div', {
  border: '1px solid $neutral300',
  borderRadius: '$xs',
  width: '$20',
  height: '$20',
});
export const Cover = styled('div', {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
});

export const ColorButton = styled(Button, {
  border: '1px solid $neutral300',
  backgroundColor: 'transparent',
  borderRadius: '$xs',
});

export const Label = styled('label', {
  display: 'inline-block',
  fontSize: '$14',
  marginBottom: '$4',
  color: '$foreground',
});
