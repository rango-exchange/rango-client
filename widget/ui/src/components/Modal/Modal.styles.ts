import { styled } from '../../theme';

export const BackDrop = styled('div', {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0)',
  zIndex: 10,
  borderRadius: '$sm',
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
  backgroundColor: '$neutral100',
  width: '100%',
  padding: '$10 $20',
  borderRadius: '$md',
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
});
export const ModalHeader = styled('div', {
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
