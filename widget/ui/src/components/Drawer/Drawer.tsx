import React from 'react';
import { styled } from '../../theme';
import { CloseIcon } from '../Icon';
import { Typography } from '../Typography';
import { createPortal } from 'react-dom';

export interface PropTypes {
  title?: string;
  open: boolean;
  onClose: () => void;
  content: React.ReactNode;
  containerStyle?: React.CSSProperties;
  anchor?: 'bottom' | 'left' | 'right' | 'top';
  showClose?: boolean;
  footer?: React.ReactNode;
  container: Element | null;
}

const BackDrop = styled('div', {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  zIndex: 9999999,
  backgroundColor: 'rgba(0,0,0,.1)',
  borderRadius: '$10',
});

const DrawerContainer = styled('div', {
  position: 'absolute',
  boxShadow: '$s',
  background: '$background',
  padding: '$20',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  zIndex: 9999999,
  borderRadius: '$10',

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

const DrawerHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  marginBottom: '$16',
});

const Body = styled('div', {
  overflowY: 'auto',
  height: '100%',
});
const Footer = styled('footer', {
  width: '100%',
  marginTop: '$28',
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
    container,
  } = props;

  const handleBackDropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <>
      {open &&
        container &&
        createPortal(
          <BackDrop onClick={handleBackDropClick}>
            <DrawerContainer anchor={anchor} style={containerStyle}>
              <DrawerHeader>
                <Typography variant="h6">{title}</Typography>
                {showClose && <CloseIcon size={24} onClick={onClose} />}
              </DrawerHeader>
              <Body>{content}</Body>
              <Footer>{footer}</Footer>
            </DrawerContainer>
          </BackDrop>,
          container
        )}
    </>
  );
}
