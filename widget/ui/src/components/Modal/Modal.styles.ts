import { styled } from '../../theme';
import { IconButton } from '../IconButton';

export const BackDrop = styled('div', {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0)',
  zIndex: 10,
  borderRadius: '$primary',
  display: 'flex',
  overflow: 'hidden',
  transition: 'background .35s',

  variants: {
    anchor: {
      bottom: {
        justifyContent: 'end',
        alignItems: 'end',
        bottom: '0',
      },
      center: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    active: {
      true: {
        backgroundColor: 'rgba(0,0,0,.1)',
      },
    },
  },
});

export const ModalContainer = styled('div', {
  backgroundColor: '$background',
  width: '100%',
  borderRadius: '$primary',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 9999999,
  transform: 'translateY(100%)',
  transition: 'transform .45s ease-in-out',

  variants: {
    anchor: {
      bottom: {
        width: '100%',
        maxHeight: '95%',
      },
      center: { height: '100%' },
    },
    active: {
      true: {
        transform: 'translateY(0)',
      },
    },
  },
});

export const Flex = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
  [`& ${IconButton}`]: {
    padding: '$5',
  },
});
export const ModalHeader = styled('div', {
  padding: '$20 $20 $0 $20',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  variants: {
    noTitle: {
      true: {
        justifyContent: 'flex-end',
      },
    },
  },
});

export const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: '$0 $20 $10 $20',
  backgroundColor: '$background',
  position: 'relative',
  overflowY: 'auto',
  overflowX: 'hidden',
});

export const Footer = styled('div', {
  '& .footer__content': {
    padding: '$0 $20',
  },
  '& .footer__logo': {
    padding: '$0 $20 $10 $20',
  },
});
