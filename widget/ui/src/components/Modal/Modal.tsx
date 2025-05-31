import type { ModalPropTypes } from './Modal.types.js';
import type { PropsWithChildren } from 'react';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { CloseIcon } from '../../icons/index.js';
import { BottomLogo } from '../BottomLogo/index.js';
import { Divider } from '../Divider/index.js';
import { IconButton } from '../IconButton/index.js';
import { Typography } from '../Typography/index.js';

import { forceReflow } from './Modal.helpers.js';
import {
  BackDrop,
  Content,
  Flex,
  Footer,
  ModalContainer,
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
    id,
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

  const handleBackDropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (event.target === event.currentTarget && dismissible) {
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
          container.style.removeProperty('overflow');
        });
      } else {
        setStatus('unmounted');
      }
    } else {
      setStatus('mounted');
      container.style.overflow = 'hidden';
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
    return () => {
      //container might be null
      container?.style.removeProperty('overflow');
    };
  }, []);

  useEffect(() => {
    if (!!container && isMount) {
      if (modalContainerRef.current) {
        forceReflow(modalContainerRef.current);
      }
      setStatus('activated');
    }
  }, [isMount, container]);

  if (status === 'unmounted' || !container) {
    return null;
  }

  return createPortal(
    <BackDrop active={active} onClick={handleBackDropClick} css={styles?.root}>
      <ModalContainer
        id={id}
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
                <IconButton
                  id={`${id}-close-btn`}
                  onClick={onClose}
                  variant="ghost">
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
      </ModalContainer>
    </BackDrop>,
    container
  );
}
