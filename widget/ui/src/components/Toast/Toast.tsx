import type { ToastProps } from './Toast.types';

import React, { useEffect } from 'react';

import { CloseIcon } from '../../icons';
import { Alert } from '../Alert';
import { IconHighlight } from '../Alert/Alert.styles';
import AlertIcon from '../Alert/AlertIcon';
import { Divider } from '../Divider';
import { IconButton } from '../IconButton';

import { useToast } from './Toast.Provider';
import {
  AlertBox,
  AlertFlexContainer,
  StyledTypography,
  ToastContentContainer,
} from './Toast.styles';

export const Toast = (props: ToastProps) => {
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
    removeToast(id, position);
    onClose?.();
  };

  return (
    <ToastContentContainer>
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
                <IconButton variant="ghost" size="xsmall" onClick={handleClose}>
                  <CloseIcon size={12} />
                </IconButton>
              ) : undefined
            }
          />
        )}
      </AlertBox>
    </ToastContentContainer>
  );
};
