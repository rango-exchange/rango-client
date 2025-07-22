import type { ToastPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { Button, Toast, ToastProvider, useToast } from '@arlert-dev/ui';
import React from 'react';

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
      options: ['success', 'warning', 'error', 'info', 'loading'],
      control: {
        type: 'select',
      },
    },
    position: {
      name: 'position',
      options: [
        'right-top',
        'left-top',
        'center-top',
        'right-bottom',
        'left-bottom',
        'center-bottom',
      ],
      control: {
        type: 'select',
      },
    },
  },
} as Meta<typeof Toast>;

export const Main = (props: ToastPropTypes) => {
  return (
    <ToastProvider container={document.body}>
      <ToastComponent {...props} />
    </ToastProvider>
  );
};

const ToastComponent = (props: ToastPropTypes) => {
  const { addToast } = useToast();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <Button
        variant="contained"
        type="success"
        onClick={() => addToast(props)}>
        Show Toast
      </Button>
    </div>
  );
};
