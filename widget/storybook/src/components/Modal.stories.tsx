import type { ModalPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { MessageBox, Modal } from '@arlert-dev/ui';
import React, { useState } from 'react';

export default {
  name: 'Modal',
  component: Modal,
  args: {
    title: 'I`m a modal',
    styles: {
      root: {},
      container: {},
      content: {},
      footer: {},
    },
  },
  argTypes: {
    open: {
      control: { type: 'boolean' },
      type: 'boolean',
    },
    onClose: {
      type: 'function',
    },
    anchor: {
      options: ['bottom', 'right', 'center'],
      control: { type: 'select' },
      description: 'bottom | right | center | undefined',
      type: 'string',
    },
    dismissible: {
      control: { type: 'boolean' },
      defaultValue: true,
      type: 'boolean',
    },
    hasWatermark: {
      control: { type: 'boolean' },
      defaultValue: true,

      type: 'boolean',
    },
    hasCloseIcon: {
      control: { type: 'boolean' },
      type: 'boolean',
      defaultValue: true,
    },
  },
} as Meta<typeof Modal>;

export const Main = (args: ModalPropTypes) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal
        {...args}
        container={document.getElementById('storybook-root')}
        open={open}
        onClose={() => setOpen(false)}>
        <MessageBox
          type="warning"
          title="Title"
          description="This is a test text"
        />
      </Modal>
    </div>
  );
};
