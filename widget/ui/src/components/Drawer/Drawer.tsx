import React from 'react';
import { createPortal } from 'react-dom';
import { styled } from '../../theme';
import { CloseIcon } from '../Icon';
import { Typography } from '../Typography';

export interface PropTypes {
  title?: string;
  open: boolean;
  onClose: () => void;
  content: React.ReactNode;
  containerStyle?: React.CSSProperties;
  anchor?: 'bottom' | 'left' | 'right' | 'top';
  showClose?: boolean;
  footer?: React.ReactNode;
}

const BackDrop = styled('div', {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',

  backgroundColor: 'rgba(0,0,0,.1)',
});

const DrawerContainer = styled('div', {
  position: 'fixed',
  boxShadow: '$s',
  background: '$background',
  padding: '$20',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',

  variants: {
    anchor: {
      left: {
        top: 0,
        left: 0,
        height: '100%',
        minWidth: '300px',
        maxWidth: '90%',
        borderTopRightRadius: '$10',
        borderBottomRightRadius: '$10',
      },
      right: {
        top: 0,
        right: 0,
        height: '100%',
        minWidth: '300px',
        maxWidth: '90%',
        borderTopLeftRadius: '$10',
        borderBottomLeftRadius: '$10',
      },
      bottom: {
        bottom: 0,
        width: '100%',
        maxHeight: '90%',
        borderTopRightRadius: '$10',
        borderTopLeftRadius: '$10',
        
      },
      top: {
        top: 0,
        width: '100%',
        maxHeight: '90%',
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
  overflowY: 'auto',
  height: '100%',
});
const Footer = styled('footer', {
  width: '100%',
  marginTop:'$28'
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
      {open &&
        createPortal(
          <BackDrop onClick={handleBackDropClick}>
            <DrawerContainer anchor={anchor} style={containerStyle}>
              <DrawerHeader>
                <Typography variant="h4">{title}</Typography>
                {showClose && <CloseIcon size={24} onClick={onClose} />}
              </DrawerHeader>
              <Body>{content}</Body>
              <Footer>{footer}</Footer>
            </DrawerContainer>
          </BackDrop>,
          document.body
        )}
    </>
  );
}
