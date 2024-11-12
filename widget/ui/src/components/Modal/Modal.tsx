import type { ModalPropTypes } from './Modal.types.js';
import type { MouseEventHandler, PropsWithChildren } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import React, { useEffect, useRef } from 'react';

import { CloseIcon } from '../../icons/index.js';
import { BottomLogo } from '../BottomLogo/index.js';
import { Divider } from '../Divider/index.js';
import { IconButton } from '../IconButton/index.js';
import { Typography } from '../Typography/index.js';

import {
  Content,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  Flex,
  Footer,
  ModalHeader,
} from './Modal.styles.js';

export function Modal(props: PropsWithChildren<ModalPropTypes>) {
  const {
    title,
    open,
    onClose,
    onExit,
    styles,
    anchor = 'bottom',
    container = document.body,
    prefix,
    header,
    dismissible = true,
    children,
    suffix,
    footer,
    hasWatermark = true,
    hasCloseIcon = true,
  } = props;
  const exitCallbackRef = useRef<ModalPropTypes['onExit']>();
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const handleBackDropClick = (open: boolean) => {
    if (dismissible && !open) {
      onClose();
    }
  };

  // Restrict the overlay click area to just the overlay element, rather than the entire page
  const handleOverlayClick: MouseEventHandler = (event) => {
    if (event.target === overlayRef.current) {
      handleBackDropClick(!open);
    }
  };

  // The escape key functionality only works when the focus is within the overlay (modal).
  const handleScapeKeyDown = () => {
    if (overlayRef.current?.querySelector(':focus')) {
      onClose();
    }
  };

  /**
   * When the user clicks on the content,
   * we return the focus to the modal content if no other element is focused,
   * ensuring the escape key functionality works.
   */
  const handleContentClick = () => {
    if (!overlayRef.current?.querySelector(':focus')) {
      modalContainerRef.current?.focus();
    }
  };

  useEffect(() => {
    exitCallbackRef.current = onExit;
  }, [onExit]);

  useEffect(() => {
    if (exitCallbackRef.current) {
      modalContainerRef.current?.addEventListener(
        'animationend',
        exitCallbackRef.current
      );
    }

    return () => {
      if (exitCallbackRef.current) {
        modalContainerRef.current?.removeEventListener(
          'animationend',
          exitCallbackRef.current
        );
      }
    };
  }, [open]);

  const renderTitle = () => {
    const result = (
      <DialogTitle>
        <Typography variant="title" size="small">
          {title}
        </Typography>
      </DialogTitle>
    );
    // This is added to prevent error "`DialogContent` requires a `DialogTitle` for the component to be accessible for screen reader users."
    return title ? result : <VisuallyHidden asChild>{result}</VisuallyHidden>;
  };

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal container={container}>
        <DialogOverlay ref={overlayRef} onClick={handleOverlayClick}>
          <DialogContent
            onClick={handleContentClick}
            onEscapeKeyDown={handleScapeKeyDown}
            ref={modalContainerRef}
            css={styles?.container}
            anchor={anchor}>
            {header ?? ( // TODO: error related to required `DialogTitle` should be handled for custom headers
              <ModalHeader noTitle={!title && dismissible && !prefix}>
                {prefix}
                {renderTitle()}
                <Flex>
                  {suffix}
                  {dismissible && hasCloseIcon && (
                    <IconButton onClick={onClose} variant="ghost">
                      <CloseIcon color="gray" size={14} />
                    </IconButton>
                  )}
                </Flex>
              </ModalHeader>
            )}
            <Content css={styles?.content}>{children}</Content>
            <Footer css={styles?.footer}>
              {footer && <div className="footer__content">{footer}</div>}

              <div
                className={`footer__logo ${
                  hasWatermark ? 'logo__show' : 'logo__hidden'
                }`}>
                <Divider size={12} />
                <BottomLogo />
              </div>
            </Footer>
          </DialogContent>
        </DialogOverlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
