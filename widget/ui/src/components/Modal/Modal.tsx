import type { PropTypes } from './Modal.types';
import type { PropsWithChildren } from 'react';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { CloseIcon } from '../../icons';
import { styled, theme } from '../../theme';
import { BottomLogo } from '../BottomLogo';
import { Divider } from '../Divider';
import { IconButton } from '../IconButton/IconButton';
import { Typography } from '../Typography';

import { BackDrop, Flex, ModalContainer, ModalHeader } from './Modal.styles';

export const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: '$0 $20 $10 $20',
  backgroundColor: '$background',
  position: 'relative',
  overflowY: 'auto',
  overflowX: 'hidden',
});

export const Footer = styled('div', {
  '& .footer__content': {
    padding: '$0 $20',
  },
  '& .footer__logo': {
    padding: '$0 $20 $10 $20',
  },
});

const CLOSED_DELAY = 600;
const OPEN_DELAY = 10;
const DEFAULT_CONTENT_PADDING = 20;

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
    footer,
    hasLogo = true,
  } = props;
  const [active, setActive] = useState(false);
  const [isMount, setIsMount] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleBackDropClick = (event: React.MouseEvent<HTMLDivElement>) => {
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
          container.style.overflow = 'unset';
        }, CLOSED_DELAY);
      }
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [open, container]);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    if (contentRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (contentRef.current) {
          const scrollable =
            contentRef.current?.scrollHeight > contentRef.current?.clientHeight;
          if (scrollable) {
            contentRef.current.style.paddingRight = `${
              parseInt(theme.sizes[DEFAULT_CONTENT_PADDING]) -
              (contentRef.current.offsetWidth - contentRef.current.clientWidth)
            }px`;
          } else {
            contentRef.current.style.paddingRight =
              theme.sizes[DEFAULT_CONTENT_PADDING];
          }
        }
      });
      resizeObserver.observe(contentRef.current);
    }
    return () => {
      if (contentRef.current) {
        resizeObserver?.unobserve(contentRef.current);
      }
    };
  }, [contentRef.current]);

  return (
    <>
      {isMount &&
        container &&
        createPortal(
          <BackDrop
            active={active}
            onClick={handleBackDropClick}
            anchor={anchor}>
            <ModalContainer
              active={active}
              css={containerStyle}
              anchor={anchor}>
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
                    <IconButton onClick={onClose} variant="ghost">
                      <CloseIcon color="gray" size={14} />
                    </IconButton>
                  )}
                </Flex>
              </ModalHeader>
              <Content ref={(ref) => (contentRef.current = ref)}>
                {children}
              </Content>
              {(hasLogo || footer) && (
                <Footer>
                  <div className="footer__content">{footer}</div>
                  {hasLogo && (
                    <div className="footer__logo">
                      <Divider size={12} />
                      <BottomLogo />
                    </div>
                  )}
                </Footer>
              )}
            </ModalContainer>
          </BackDrop>,
          container
        )}
    </>
  );
}
