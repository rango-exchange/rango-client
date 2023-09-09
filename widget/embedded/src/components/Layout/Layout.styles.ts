import { styled } from '@rango-dev/ui';

export const Container = styled('div', {
  height: '100%',
  borderRadius: '$xl',
});
export const Content = styled('div', {
  padding: '$20',
  height: '100%',
  borderTopLeftRadius: '$md',
  borderTopRightRadius: '$md',
  backgroundColor: '$background',
  position: 'relative',
});

export const Footer = styled('div', {
  padding: '$10 $20',
  backgroundColor: '$background',
});
