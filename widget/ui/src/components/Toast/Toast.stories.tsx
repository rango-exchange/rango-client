import type { ToastProps } from './Toast.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { Button } from '../Button';

import { ToastStoryContainer } from './Toast.styles';

import { Toast, ToastProvider, useToast } from '.';

export default {
  title: 'Components/Toast',
  component: Toast,
  args: {
    type: 'success',
    title: 'Please change your wallet network to Polygon',
    autoHideDuration: 5_000,
    horizontal: 'right',
  },
  argTypes: {
    type: {
      name: 'type',
      control: {
        type: 'select',
        options: ['success', 'warning', 'error', 'info', 'loading'],
      },
    },
  },
} as Meta<typeof Toast>;

export const TopToasts = (props: ToastProps) => {
  return (
    <ToastProvider
      container={document.body}
      anchorOrigin={{
        horizontal: props.horizontal,
        vertical: 'top',
      }}>
      <ToastComponent {...props} />
    </ToastProvider>
  );
};

export const BottomToasts = (props: ToastProps) => {
  return (
    <ToastProvider
      container={document.body}
      anchorOrigin={{
        horizontal: props.horizontal,
        vertical: 'bottom',
      }}>
      <ToastComponent {...props} />
    </ToastProvider>
  );
};

const ToastComponent = (props: ToastProps) => {
  const { addToast } = useToast();

  return (
    <ToastStoryContainer>
      <Button
        variant="contained"
        type="success"
        onClick={() => addToast(props)}>
        Show Toast
      </Button>
    </ToastStoryContainer>
  );
};
