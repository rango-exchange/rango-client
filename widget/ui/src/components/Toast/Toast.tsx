import React, { useEffect } from 'react';
import { Button } from '../Button';
import {
  CheckCircleIcon,
  CloseIcon,
  InfoCircleIcon,
  WarningIcon,
} from '../Icon';
import { Typography } from '../Typography';
import { styled, keyframes } from '../../theme';
import { ToastType, useToast } from './Provider';
import { Spacer } from '../Spacer';
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
  background: '$background',

  '.main': {
    display: 'flex',
    alignItems: 'center',
  },
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
      primary: {
        color: '$primary200',
      },
      secondary: {
        color: '$foreground',
      },
      success: {
        color: '$success300',
      },
      warning: {
        color: '$warning500',
      },
      error: {
        color: '$error300',
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
  type,
  showIcon,
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

      <div className="main">
        {showIcon && (
          <>
            <div
              style={{
                width: '32px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {type === 'success' && <CheckCircleIcon color={type} size={24} />}
              {type === 'warning' && <WarningIcon color={type} size={24} />}
              {type === 'error' && <InfoCircleIcon color={type} size={24} />}
              <Spacer size={8} />
            </div>
          </>
        )}
        <div>
          {title && (
            <>
              <Typography color={type} variant="h6" mb={4}>
                {title}
              </Typography>
              <br />
            </>
          )}

          <Typography color={type} variant="body2">
            {message}
          </Typography>
        </div>
      </div>
    </Container>
  );
};
