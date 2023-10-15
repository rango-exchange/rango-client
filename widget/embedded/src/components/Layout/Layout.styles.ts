import { styled } from '@rango-dev/ui';

export const Container = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '$primary',
  overflow: 'hidden !important',
  boxShadow: '15px 15px 15px 0px rgba(0, 0, 0, 0.05)',
  width: '95vw',
  maxWidth: '390px',
  maxHeight: '700px',
  backgroundColor: '$neutral100',
  variants: {
    fixedHeight: {
      true: {
        height: '95vh',
      },
      false: {
        height: 'auto',
      },
    },
  },
});
export const Content = styled('div', {
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: '$20 $20 $10 $20',
  backgroundColor: '$background',
  position: 'relative',
  overflowY: 'auto',
  overflowX: 'hidden',
  variants: {
    noPadding: {
      true: {
        padding: '0',
      },
    },
  },
});

export const Footer = styled('div', {
  backgroundColor: '$background',
  '& .footer__content': {
    padding: '$0 $20',
  },
  '& .footer__logo': {
    padding: '$0 $20 $10 $20',
  },
});
