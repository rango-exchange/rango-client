import type { PropTypes } from './Modal.types';
import type { PropsWithChildren } from 'react';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { CloseIcon } from '../../icons';
import { Divider } from '../Divider';
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
    if (open) {
      container.style.overflow = 'hidden';
    } else {
      container.style.overflow = 'unset';
    }
  }, [open]);
  return (
    <>
      {open &&
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
                      <CloseIcon color="gray" />
                    </IconButton>
                  )}
                </Flex>
              </ModalHeader>
              <Divider direction="vertical" size={16} />
              {children}
            </ModalContainer>
          </BackDrop>,
          container
        )}
    </>
  );
}
