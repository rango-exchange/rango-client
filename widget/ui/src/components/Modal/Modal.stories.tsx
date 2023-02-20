import React, { useState } from 'react';
import { ComponentMeta } from '@storybook/react';
import { Modal, PropTypes } from './Modal';

export default { name: 'Modal', component: Modal } as ComponentMeta<
  typeof Modal
>;

export const Main = (args: PropTypes) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal
        {...args}
        open={open}
        title="I'm modal"
        onClose={() => setOpen(false)}
      />
    </div>
  );
};
