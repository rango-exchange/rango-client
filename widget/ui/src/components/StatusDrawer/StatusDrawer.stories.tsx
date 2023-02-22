import React, { useState } from 'react';
import { ComponentMeta } from '@storybook/react';
import { StatusDrawer, PropTypes } from './StatusDrawer';
import { SwapContainer } from '../SwapContainer';

export default {
  name: 'Components/StatusDrawer',
  component: StatusDrawer,
  argTypes: {
    status: {
      name: 'status',
      control: { type: 'select' },
      options: ['continue', 'success', 'failed'],
      defaultValue: 'success',
    },
    title: {
      name: 'title',
      control: { type: 'text' },
      defaultValue: 'Swap successful',
    },
    subtitle: {
      name: 'subtitle',
      control: { type: 'text' },
      defaultValue:
        'There are now 0.0493 BNB in 0x542...C2Df wallet on BSC chain.',
    },
  },
} as ComponentMeta<typeof StatusDrawer>;

export const Main = (args: PropTypes) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <SwapContainer>
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <StatusDrawer {...args} open={open} onClose={() => setOpen(false)} />
    </SwapContainer>
  );
};
