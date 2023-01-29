import React, { useState } from 'react';
import { ComponentMeta } from '@storybook/react';
import { Drawer, PropTypes } from './Drawer';

export default {
  name: 'Components/Drawer',
  component: Drawer,
} as ComponentMeta<typeof Drawer>;

export const Main = (args: PropTypes) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <Drawer
        {...args}
        open={open}
        title="I'm Drawer"
        onClose={() => setOpen(false)}
      />
    </div>
  );
};
