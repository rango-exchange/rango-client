import { styled } from '@rango-dev/ui';

export const Container = styled('div', {
  height: '100%',
  //TODO: add radii theme token for 20px
  borderRadius: '20px',
  width: '95vw',
  maxWidth: '390px',
  maxHeight: '700px',
  variants: {
    fixedHeight: {
      true: {
        height: '90vh',
      },
      false: {
        height: 'auto',
      },
    },
  },
});
export const Content = styled('div', {
  padding: '$20 $20 $10',
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
