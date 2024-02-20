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
    position: 'right-top',
    variant: 'standard',
  },
  argTypes: {
    type: {
      name: 'type',
      control: {
        type: 'select',
        options: ['success', 'warning', 'error', 'info', 'loading'],
      },
    },
    position: {
      name: 'position',
      control: {
        type: 'select',
        options: [
          'right-top',
          'left-top',
          'center-top',
          'right-bottom',
          'left-bottom',
          'center-bottom',
        ],
      },
    },
  },
} as Meta<typeof Toast>;

export const Main = (props: ToastProps) => {
  return (
    <ToastProvider container={document.body}>
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
