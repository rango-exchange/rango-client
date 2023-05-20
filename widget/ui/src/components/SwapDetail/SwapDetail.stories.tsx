import React from 'react';
import { Meta } from '@storybook/react';
import { SwapDetail, PropTypes } from './SwapDetail';
import { swap } from './mock';

export default {
  title: 'Components/Swap Detail',
  component: SwapDetail,
  args:{
    status:'running'
  },
  argTypes: {
    status: {
      name: 'status',
      control: { type: 'select' },
      options: ['running', 'failed', 'success'],
      defaultValue: 'running',
    },
  },
} as Meta<typeof SwapDetail>;

export const Main = (props: PropTypes) => <SwapDetail {...props} swap={swap} />;
