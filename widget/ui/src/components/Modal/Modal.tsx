import React from 'react';

import { styled } from '../../theme';
import CloseIcon from '../Icon/Close';
import Typography from '../Typography';

export interface PropTypes {
  title: string;
  open: boolean;
  onClose: () => void;
  content: React.ReactNode;
  containerStyle: React.CSSProperties;
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

const ModalContainer = styled('div', {
  backgroundColor: '$background',
  borderRadius: '$10',
  padding: '$16 $16',
  display: 'flex',
  flexDirection: 'column',
});

const ModalHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  marginBottom: '$16',
});

const ContentContainer = styled('div', {
  overflowY: 'scroll',
});

function Modal(props: PropTypes) {
  const { title, content, open, onClose, containerStyle } = props;

  const handleBackDropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <>
      {open && (
        <BackDrop onClick={handleBackDropClick}>
          <ModalContainer style={containerStyle}>
            <ModalHeader>
              <Typography variant="h4">{title}</Typography>
              <CloseIcon size={24} onClick={onClose} />
            </ModalHeader>
            <ContentContainer>{content}</ContentContainer>
          </ModalContainer>
        </BackDrop>
      )}
    </>
  );
}

export default Modal;
