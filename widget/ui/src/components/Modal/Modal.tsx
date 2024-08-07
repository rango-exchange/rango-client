import type { ModalPropTypes } from './Modal.types';
import type { PropsWithChildren } from 'react';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { CloseIcon } from '../../icons';
import { BottomLogo } from '../BottomLogo';
import { Divider } from '../Divider';
import { Header } from '../Header';
import { IconButton } from '../IconButton/IconButton';
import { Typography } from '../Typography';

import {
  BackDrop,
  Content,
  Flex,
  Footer,
  ModalContainer,
} from './Modal.styles';

const CLOSED_DELAY = 600;
const OPEN_DELAY = 100;

export function Modal(props: PropsWithChildren<ModalPropTypes>) {
  const {
    title,
    open,
    onClose,
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

  const [active, setActive] = useState(false);
  const [isMount, setIsMount] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBackDropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (event.target === event.currentTarget && dismissible) {
      onClose();
    }
  };
  useEffect(() => {
    if (container) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (open) {
        setIsMount(true);
        container.style.overflow = 'hidden';
        timeoutRef.current = setTimeout(() => {
          setActive(true);
        }, OPEN_DELAY);
      } else {
        setActive(false);
        timeoutRef.current = setTimeout(() => {
          setIsMount(false);
          container.style.removeProperty('overflow');
        }, CLOSED_DELAY);
      }
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [open, container]);

  return (
    <>
      {isMount &&
        container &&
        createPortal(
          <BackDrop
            active={active}
            onClick={handleBackDropClick}
            css={styles?.root}>
            <ModalContainer
              active={active}
              css={styles?.container}
              anchor={anchor}>
              {header ?? (
                <Header
                  prefix={prefix}
                  title={
                    <Typography variant="title" size="small">
                      {title}
                    </Typography>
                  }
                  suffix={
                    <Flex>
                      {suffix}
                      {dismissible && hasCloseIcon && (
                        <IconButton onClick={onClose} variant="ghost">
                          <CloseIcon color="gray" size={14} />
                        </IconButton>
                      )}
                    </Flex>
                  }
                  transparent
                  css={{ padding: '$20 $20 $0 $20', minHeight: '44px' }}
                  disableCurves
                />
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
        )}
    </>
  );
}
