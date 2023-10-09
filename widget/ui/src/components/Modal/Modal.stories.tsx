import type { PropTypes } from './Modal.types';
import type { Meta } from '@storybook/react';

import React, { useState } from 'react';

import { MessageBox } from '../MessageBox';

import { Modal } from './Modal';

export default {
  name: 'Modal',
  component: Modal,
  args: {
    title: 'I`m a modal',
    container: document.getElementById('storybook-root'),
  },
} as Meta<typeof Modal>;

export const Main = (args: PropTypes) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal {...args} open={open} onClose={() => setOpen(false)}>
        <MessageBox
          type="warning"
          title="Title"
          description="This is a test text"
        />
      </Modal>
    </div>
  );
};
