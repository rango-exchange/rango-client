import type { ModalPropTypes } from './Modal.types.js';
import type { PropsWithChildren } from 'react';

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

  const handleBackDropClick = (open: boolean) => {
    if (dismissible && !open) {
      onClose();
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
      <Dialog.DialogTitle>
        <Typography variant="title" size="small">
          {title}
        </Typography>
      </Dialog.DialogTitle>
    );
    // This is added to prevent error "`DialogContent` requires a `DialogTitle` for the component to be accessible for screen reader users."
    return title ? result : <VisuallyHidden>{result}</VisuallyHidden>;
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleBackDropClick}>
      <Dialog.Portal container={container}>
        <DialogOverlay>
          <DialogContent
            ref={modalContainerRef}
            css={styles?.container}
            anchor={anchor}>
            {header ?? (
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
