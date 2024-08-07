import { styled } from '../../theme';
import { IconButton } from '../IconButton';

export const BackDrop = styled('div', {
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent',
  zIndex: 10,
  borderRadius: '$primary',
  overflow: 'hidden',
  transition: 'background .35s',

  variants: {
    active: {
      true: {
        backgroundColor: 'color-mix(in srgb, $neutral500 70%, transparent)',
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
  position: 'absolute',
  transition:
    'transform .45s ease-in-out, top .45s ease-in-out, left .45s ease-in-out',

  variants: {
    anchor: {
      right: {
        left: '100%',
      },
      center: {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
      },
      bottom: {
        top: '100%',
      },
    },
    active: {
      true: {},
    },
  },
  compoundVariants: [
    {
      active: true,
      anchor: 'right',
      css: {
        transform: 'translateX(-100%)',
      },
    },
    {
      active: true,
      anchor: 'center',
      css: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    },
    {
      active: true,
      anchor: 'bottom',
      css: {
        transform: 'translateY(-100%)',
      },
    },
  ],
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
  padding: '0 $20 $10',
  '& .footer__logo': {
    '&.logo__show': {
      opacity: 1,
    },
    '&.logo__hidden': {
      visibility: 'hidden',
    },
  },
});
