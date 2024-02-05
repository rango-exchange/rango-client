import { styled } from '../../theme';
import { IconButton } from '../IconButton';

export const BackDrop = styled('div', {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent',
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
      right: {
        right: '0',
        left: 'unset',
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0',
        justifyContent: 'end',
      },
    },
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
  transform: 'translateY(100%)',
  transition: 'transform .45s ease-in-out',

  variants: {
    anchor: {
      bottom: {
        width: '100%',
        maxHeight: '95%',
      },
      center: { height: '100%' },
      right: {
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0',
        transform: 'translateX(100%)',
      },
    },
    active: {
      true: {
        transform: 'translateY(0)',
      },
    },
  },
  compoundVariants: [
    {
      active: true,
      anchor: 'right',
      css: {
        transform: 'translateX(0)',
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
