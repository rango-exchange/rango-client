import { CSSProperties } from '@stitches/react';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { styled } from '../../theme';
import { Header } from '../Header';

export interface PropTypes {
  title: string;
  open: boolean;
  onClose: () => void;
  content: React.ReactNode;
  action?: React.ReactNode;
  containerStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  hasSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: React.ChangeEventHandler<HTMLInputElement>;
  searchText?: string;
  hasHeaderTitle?: boolean;
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
  boxShadow: '$s',
  zIndex: 10,
});

const ModalHeader = styled('div', {
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  width: '100%',
});

const ContentContainer = styled('div', {});

export function Modal(props: PropTypes) {
  const {
    title,
    content,
    open,
    onClose,
    containerStyle,
    action,
    contentStyle,
    hasSearch = false,
    searchPlaceholder,
    onSearchChange,
    searchText,
    hasHeaderTitle = true,
  } = props;

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
            <ModalContainer style={containerStyle}>
              <ModalHeader>
                <Header
                  action={action}
                  hasHeaderTitle={hasHeaderTitle}
                  onClose={onClose}
                  title={title}
                  hasSearch={hasSearch}
                  searchPlaceholder={searchPlaceholder}
                  onSearchChange={onSearchChange}
                  searchText={searchText}
                />
              </ModalHeader>
              <ContentContainer style={contentStyle}>
                {content}
              </ContentContainer>
            </ModalContainer>
          </BackDrop>,
          document.body
        )}
    </>
  );
}
