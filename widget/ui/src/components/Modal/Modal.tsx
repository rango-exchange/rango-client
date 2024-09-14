import type { ModalPropTypes } from './Modal.types.js';
import type { PropsWithChildren } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import React, { useEffect, useRef, useState } from 'react';

import { CloseIcon } from '../../icons/index.js';
import { BottomLogo } from '../BottomLogo/index.js';
import { Divider } from '../Divider/index.js';
import { IconButton } from '../IconButton/index.js';
import { Typography } from '../Typography/index.js';

import { forceReflow } from './Modal.helpers.js';
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

  const [status, setStatus] = useState<
    'unmounted' | 'mounted' | 'activated' | 'deactivated'
  >('unmounted');
  const active = status === 'activated';
  const isMount =
    status == 'mounted' || status === 'activated' || status === 'deactivated';
  const modalContainerRef = useRef<HTMLElement | null>(null);
  const exitCallbackRef = useRef<ModalPropTypes['onExit']>();

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
        'transitionend',
        exitCallbackRef.current
      );
    }

    if (!open) {
      if (status === 'activated') {
        setStatus('deactivated');
        modalContainerRef.current?.addEventListener('transitionend', () => {
          setStatus('unmounted');
        });
      } else {
        setStatus('unmounted');
      }
    } else {
      setStatus('mounted');
    }

    return () => {
      if (exitCallbackRef.current) {
        modalContainerRef.current?.removeEventListener(
          'transitionend',
          exitCallbackRef.current
        );
      }
    };
  }, [open]);

  useEffect(() => {
    if (!!container && isMount) {
      if (modalContainerRef.current) {
        forceReflow(modalContainerRef.current);
      }
      setStatus('activated');
    }
  }, [isMount, container]);

  return (
    <Dialog.Root
      open={status !== 'unmounted' && !!container}
      onOpenChange={handleBackDropClick}>
      <Dialog.Portal container={container}>
        <DialogOverlay active={active} />
        <DialogContent
          active={active}
          css={styles?.container}
          anchor={anchor}
          ref={(ref) => (modalContainerRef.current = ref)}>
          {header ?? (
            <ModalHeader noTitle={!title && dismissible && !prefix}>
              {prefix}
              {title && (
                <Typography variant="title" size="small">
                  {title}
                </Typography>
              )}
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
      </Dialog.Portal>
    </Dialog.Root>
  );
}
