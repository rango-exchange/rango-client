import { Button, styled } from '@rango-dev/ui';

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  position: 'relative',
});

export const ColorContainer = styled('div', {
  border: '1px solid $neutral300',
  borderRadius: '$xs',
  width: '$20',
  height: '$20',
});

export const ColorButton = styled(Button, {
  border: '1px solid $neutral300',
  backgroundColor: 'transparent',
  borderRadius: '$xs',
  width: 93,
  justifyContent: 'normal',
});
