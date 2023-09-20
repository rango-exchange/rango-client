import type { PropTypes } from './Modal.types';
import type { PropsWithChildren } from 'react';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { CloseIcon } from '../../icons';
import { IconButton } from '../IconButton/IconButton';
import { Typography } from '../Typography';

import { BackDrop, Flex, ModalContainer, ModalHeader } from './Modal.styles';

export function Modal(props: PropsWithChildren<PropTypes>) {
  const {
    title,
    open,
    onClose,
    containerStyle,
    anchor = 'bottom',
    container = document.body,
    prefix,
    dismissible = true,
    children,
    suffix,
  } = props;

  const handleBackDropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && dismissible) {
      onClose();
    }
  };
  useEffect(() => {
    if (container) {
      if (open) {
        container.style.overflow = 'hidden';
      } else {
        container.style.overflow = 'unset';
      }
    }
  }, [open, container]);
  return (
    <>
      {open &&
        container &&
        createPortal(
          <BackDrop onClick={handleBackDropClick} anchor={anchor}>
            <ModalContainer css={containerStyle} anchor={anchor}>
              <ModalHeader noTitle={!title}>
                {prefix}
                {title && (
                  <Typography variant="title" size="small">
                    {title}
                  </Typography>
                )}
                <Flex>
                  {suffix}
                  {dismissible && (
                    <IconButton onClick={onClose}>
                      <CloseIcon color="gray" size={14} />
                    </IconButton>
                  )}
                </Flex>
              </ModalHeader>
              {children}
            </ModalContainer>
          </BackDrop>,
          container
        )}
    </>
  );
}
