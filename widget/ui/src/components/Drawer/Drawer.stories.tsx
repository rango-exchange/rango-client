import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import { Drawer, PropTypes } from './Drawer';

export default {
  name: 'Components/Drawer',
  component: Drawer,
  args: {
    anchor: 'bottom',
    title: 'I`m Drawer',
    container: document.body,
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
      <Drawer
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        content={
          <div>
            {Array.from({ length: 50 }, (_, index) => (
              <div>Test {index}</div>
            ))}
          </div>
        }
      />
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
        anchor="left"
        content={
          <div>
            {Array.from({ length: 50 }, (_, index) => (
              <span>Test {index} </span>
            ))}
          </div>
        }
      />
    </div>
  );
};
