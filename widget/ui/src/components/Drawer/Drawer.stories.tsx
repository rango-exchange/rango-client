import type { PropTypes } from './Drawer.types';
import type { Meta } from '@storybook/react';

import React, { useState } from 'react';

import { Drawer } from './Drawer';

export default {
  name: 'Components/Drawer',
  component: Drawer,
  args: {
    anchor: 'bottom',
    title: 'I`m Drawer',
  },
  argTypes: {
    anchor: {
      name: 'anchor',
      control: { type: 'select' },
      options: ['bottom', 'left', 'right', 'top'],
      defaultValue: 'bottom',
    },
  },
} as Meta<typeof Drawer>;

export const Main = (args: PropTypes) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <Drawer {...args} open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export const EmptyContent = (args: PropTypes) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <Drawer {...args} open={open} onClose={() => setOpen(false)} />
    </div>
  );
};
export const BottomAnchor = (args: PropTypes) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <Drawer {...args} open={open} onClose={() => setOpen(false)}>
        <div>
          {Array.from({ length: 50 }, (_, index) => (
            <div key={index}>Test {index}</div>
          ))}
        </div>
      </Drawer>
    </div>
  );
};

export const LeftAnchor = (args: PropTypes) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <Drawer
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        anchor="left">
        <div>
          {Array.from({ length: 50 }, (_, index) => (
            <span key={index}>Test {index} </span>
          ))}
        </div>
      </Drawer>
    </div>
  );
};
