import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import { Modal, PropTypes } from './Modal';

export default {
  name: 'Modal',
  component: Modal,
  args: {
    title: 'I`m a modal',
  },
} as Meta<typeof Modal>;

export const Main = (args: PropTypes) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal {...args} open={open} onClose={() => setOpen(false)} />
    </div>
  );
};
