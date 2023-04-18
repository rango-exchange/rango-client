import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { Toast } from './Toast';
import { Button } from '../Button';
import { ToastProvider, useToast } from './Provider';

export default {
  title: 'Components/Toast',
  component: Toast,
} as ComponentMeta<typeof Toast>;

export const Main = () => (
  <ToastProvider>
    <Example />
  </ToastProvider>
);

const Example = () => {
  const { addToast } = useToast();

  return (
    <div>
      <p>This is an example of using Toast</p>

      <Button
        onClick={() =>
          addToast({
            message: 'This is an example of using Toast',
            title: 'Example',
            hasClose: true,
          })
        }
      >
        Show Toast
      </Button>
    </div>
  );
};
