import { CSS } from '@stitches/react';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { config, styled } from '../../theme';
import { CloseIcon } from '../Icon/CloseIcon';
import { Typography } from '../Typography';

export interface PropTypes {
  title: string;
  open: boolean;
  onClose: () => void;
  content: React.ReactNode;
  action?: React.ReactNode;
  containerStyle?: CSS<typeof config>;
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
  zIndex: 10,
});

const ModalContainer = styled('div', {
  backgroundColor: '$background',
  borderRadius: '$10',
  padding: '$16 $16',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 20,
});
const Row = styled('div', {
  display: 'flex',
  alignItems: 'center',
});
const ModalHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  marginBottom: '$16',
});

export function Modal(props: PropTypes) {
  const { title, content, open, onClose, containerStyle, action } = props;

  const handleBackDropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [open]);
  return (
    <>
      {open &&
        createPortal(
          <BackDrop onClick={handleBackDropClick}>
            <ModalContainer css={containerStyle}>
              <ModalHeader>
                <Typography variant="title" size="medium">
                  {title}
                </Typography>
                <Row>
                  {action}
                  <CloseIcon size={24} onClick={onClose} />
                </Row>
              </ModalHeader>
              {content}
            </ModalContainer>
          </BackDrop>,
          document.body
        )}
    </>
  );
}
