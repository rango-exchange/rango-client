import React from 'react';
import { styled } from '../../theme';
import { Close } from '../Icon/Close';
import { Typography } from '../Typography';

export interface PropTypes {
  title: string;
  open: boolean;
  onClose: () => void;
  content: React.ReactNode;
  containerStyle: React.CSSProperties;
  anchor?: 'bottom' | 'left' | 'right' | 'top';
  showClose?: boolean;
  footer: React.ReactNode;
}

const BackDrop = styled('div', {
  position: 'fixed',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  top: '0',
  left: '0',
  width: '100vw',
  height: '100vh',

  backgroundColor: 'rgba(0,0,0,.1)',
});

const DrawerContainer = styled('div', {
  position: 'fixed',
  boxShadow: '$s',
  background: '$background',
  padding: '20px',

  variants: {
    anchor: {
      left: {
        top: 0,
        left: 0,
        height: '100%',
        width: '300px',
        borderTopRightRadius: '$10',
        borderBottomRightRadius: '$10',
      },
      right: {
        top: 0,
        right: 0,
        height: '100%',
        width: '300px',
        borderTopLeftRadius: '$10',
        borderBottomLeftRadius: '$10',
      },
      bottom: {
        bottom: 0,
        width: '100%',
        height: '300px',
        borderTopRightRadius: '$10',
        borderTopLeftRadius: '$10',
      },
      top: {
        top: 0,
        width: '100%',
        height: '300px',
        borderBottomRightRadius: '$10',
        borderBottomLeftRadius: '$10',
      },
    },
  },
});

const DrawerHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  marginBottom: '$16',
});

const Body = styled('div', {
  overflowY: 'scroll',
});
const Footer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  bottom: 20,
});

export function Drawer(props: PropTypes) {
  const {
    title,
    content,
    open,
    onClose,
    containerStyle,
    anchor = 'bottom',
    showClose = false,
    footer,
  } = props;

  const handleBackDropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <>
      {open && (
        <BackDrop onClick={handleBackDropClick}>
          <DrawerContainer anchor={anchor} style={containerStyle}>
            <DrawerHeader>
              <Typography variant="h4">{title}</Typography>
              {showClose && <Close size={24} onClick={onClose} />}
            </DrawerHeader>
            <Body>{content}</Body>
            <Footer>{footer}</Footer>
          </DrawerContainer>
        </BackDrop>
      )}
    </>
  );
}
