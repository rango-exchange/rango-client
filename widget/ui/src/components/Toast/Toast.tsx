import type { ToastPropTypes } from './Toast.types.js';

import React, { useEffect, useState } from 'react';

import { CloseIcon } from '../../icons/index.js';
import AlertIcon from '../Alert/Alert.icon.js';
import { IconHighlight } from '../Alert/Alert.styles.js';
import { Alert } from '../Alert/index.js';
import { Divider } from '../Divider/index.js';
import { IconButton } from '../IconButton/index.js';

import { TOAST_HIDE_DELAY, TOAST_UNMOUNT_DELAY } from './Toast.helpers.js';
import { useToast } from './Toast.Provider.js';
import {
  AlertBox,
  AlertFlexContainer,
  StyledTypography,
  ToastContentContainer,
  toastContentStyles,
} from './Toast.styles.js';

export const Toast = (props: ToastPropTypes) => {
  const {
    id,
    autoHideDuration,
    onClose,
    type,
    title,
    position,
    hasCloseIcon = true,
    hideOnTap = true,
    variant = 'standard',
  } = props;
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { removeToast } = useToast();
  useEffect(() => {
    let cleanup;

    if (autoHideDuration) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);

      cleanup = () => clearTimeout(timer);
    }

    return cleanup;
  }, [id]);

  const handleClose = () => {
    setIsActive(false);
    setTimeout(() => {
      setIsVisible(false);
    }, TOAST_HIDE_DELAY);
    setTimeout(() => {
      removeToast(id, position);
      onClose?.();
    }, TOAST_UNMOUNT_DELAY);
  };

  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => {
      setIsActive(true);
    }, 0);
  }, []);

  return (
    <ToastContentContainer
      isActive={isActive}
      position={position}
      isVisible={isVisible}>
      <div className={toastContentStyles()}>
        <AlertBox
          onClick={hideOnTap ? handleClose : undefined}
          variant={variant}
          type={type}>
          {variant === 'custom' ? (
            <AlertFlexContainer>
              <IconHighlight type={type} align="center">
                <AlertIcon type={type} />
              </IconHighlight>
              <Divider direction="horizontal" size={10} />
              <StyledTypography variant="body" size="small" align="left">
                {props.title}
              </StyledTypography>
            </AlertFlexContainer>
          ) : (
            <Alert
              title={title}
              type={type}
              variant="alarm"
              titleAlign="left"
              action={
                hasCloseIcon ? (
                  <IconButton
                    variant="ghost"
                    size="xsmall"
                    onClick={handleClose}>
                    <CloseIcon size={12} />
                  </IconButton>
                ) : undefined
              }
            />
          )}
        </AlertBox>
      </div>
    </ToastContentContainer>
  );
};
