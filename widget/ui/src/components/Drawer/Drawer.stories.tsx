import React, { useState } from 'react';
import { ComponentMeta } from '@storybook/react';
import { Drawer, PropTypes } from './Drawer';

export default {
  name: 'Components/Drawer',
  component: Drawer,
  argTypes: {
    anchor: {
      name: 'anchor',
      control: { type: 'select' },
      options: ['bottom', 'left', 'right', 'top'],
      defaultValue: 'bottom',
    },
  },
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
        title="I'm Drawer"
        onClose={() => setOpen(false)}
        anchor="bottom"
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
        title="I'm Drawer"
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
