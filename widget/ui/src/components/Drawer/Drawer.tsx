import type { PropTypes } from './Drawer.types';
import type { PropsWithChildren } from 'react';

import React from 'react';
import { createPortal } from 'react-dom';

import { CloseIcon } from '../../icons';
import { Divider } from '../Divider';
import { IconButton } from '../IconButton/IconButton';
import { Typography } from '../Typography';

import {
  BackDrop,
  Body,
  DrawerContainer,
  DrawerHeader,
  Footer,
} from './Drawer.styles';

export function Drawer(props: PropsWithChildren<PropTypes>) {
  const {
    title,
    open,
    onClose,
    anchor = 'bottom',
    dismissible = true,
    footer,
    container = document.body,
    prefix,
    children,
  } = props;

  const handleBackDropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && dismissible) {
      onClose();
    }
  };

  return (
    <>
      {container &&
        open &&
        createPortal(
          <BackDrop onClick={handleBackDropClick}>
            <DrawerContainer anchor={anchor}>
              <DrawerHeader>
                {prefix}
                <Typography variant="title" size="small">
                  {title}
                </Typography>
                {dismissible && (
                  <IconButton onClick={onClose}>
                    <CloseIcon color="gray" />
                  </IconButton>
                )}
              </DrawerHeader>
              <Divider size={16} />
              <Body>{children}</Body>
              <Footer>{footer}</Footer>
            </DrawerContainer>
          </BackDrop>,
          container
        )}
    </>
  );
}
