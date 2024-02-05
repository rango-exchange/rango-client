import { styled } from '@rango-dev/ui';

const WIDGET_HEIGHT = '700px';

export const Container = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '$primary',
  width: '100vw',
  minWidth: '300px',
  maxWidth: '390px',
  boxShadow: '15px 15px 15px 0px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  backgroundColor: '$background',

  variants: {
    height: {
      auto: {
        height: 'auto',
        maxHeight: WIDGET_HEIGHT,
      },
      fixed: {
        height: WIDGET_HEIGHT,
      },
    },
  },
});

export const Content = styled('div', {
  position: 'relative',
  overflow: 'hidden',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  overflowY: 'auto',
});

export const Footer = styled('div', {
  padding: '0 $20 $10',
  '& .footer__logo': {
    opacity: 0,
    transition: 'opacity 1s ease-in-out',
    '&.logo__show': {
      opacity: 1,
    },
    '&.logo__hidden': {
      visibility: 'hidden',
    },
  },
});
