import React, { useEffect } from 'react';
import { Button } from '../Button';
import { CloseIcon } from '../Icon';
import { Typography } from '../Typography';
import { styled, keyframes } from '../../theme';
import { ToastType, useToast } from './Provider';
const toast_opacity = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const Container = styled('div', {
  boxSizing: 'border-box',
  minWidth: 270,
  maxWidth: 450,
  wordBreak: 'break-all',
  boxShadow: '$xs',
  borderRadius: '$3',
  padding: '$12',
  border: '1px solid $neutrals300',
  position: 'relative',
  margin: '$12 0',
  variants: {
    horizontal: {
      right: {
        right: 12,
        transition: 'transform .6s ease-in-out',
        animation: `${toast_opacity} .7s`,
      },
      left: {
        left: 12,
        transition: 'transform .6s ease-in',
        animation: `${toast_opacity} .7s`,
      },
    },
    type: {
      default: {
        background: '$background',
      },
      primary: {
        background: '$primary200',
      },
      secondary: {
        background: '$foreground',
      },
      success: {
        background: '$success300',
      },
      warning: {
        background: '$warning500',
      },
      error: {
        background: '$error300',
      },
    },
  },
});
const ButtonWrapper = styled('div', {
  position: 'absolute',
  right: 3,
  top: 3,
});
export const Toast = ({
  title,
  message,
  hasClose,
  id,
  horizontal = 'right',
  type = 'default',
}: ToastType & { horizontal: 'left' | 'right' }) => {
  const { removeToast } = useToast();
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [id]);

  return (
    <Container horizontal={horizontal} type={type}>
      {hasClose && (
        <ButtonWrapper>
          <Button
            size="compact"
            variant="ghost"
            prefix={<CloseIcon size={18} />}
            onClick={() => removeToast(id)}
          />
        </ButtonWrapper>
      )}
      {title && (
        <>
          <Typography variant="h6" mb={4}>
            {title}
          </Typography>
          <br />
        </>
      )}

      <Typography variant="body2">{message}</Typography>
    </Container>
  );
};
