import { styled } from '../../theme';

export const BackDrop = styled('div', {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  zIndex: 9999999,
  backgroundColor: 'rgba(0,0,0,.1)',
  borderRadius: '$sm',
});

export const DrawerContainer = styled('div', {
  position: 'absolute',
  background: '$background',
  padding: '$10 $20',
  borderRadius: '$sm',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  zIndex: 9999999,
  boxSizing: 'border-box',
  variants: {
    anchor: {
      left: {
        top: 0,
        left: 0,
        height: '100%',
        minWidth: '300px',
        maxWidth: '90%',
      },
      right: {
        top: 0,
        right: 0,
        height: '100%',
        minWidth: '300px',
        maxWidth: '90%',
      },
      bottom: {
        bottom: 0,
        width: '100%',
        maxHeight: '90%',
      },
      top: {
        top: 0,
        width: '100%',
        maxHeight: '90%',
      },
    },
  },
});

export const DrawerHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
});

export const Body = styled('div', {
  overflowY: 'auto',
  height: '100%',
});
export const Footer = styled('footer', {
  width: '100%',
});
