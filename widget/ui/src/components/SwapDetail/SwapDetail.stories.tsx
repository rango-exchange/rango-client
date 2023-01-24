import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { SwapDetail, PropTypes } from './SwapDetail';
import { swap } from './mock';

export default {
  title: 'Components/Swap Detail',
  component: SwapDetail,
  argTypes: {
    status: {
      name: 'status',
      control: { type: 'select' },
      options: ['running', 'failed', 'success'],
      defaultValue: 'running',
    },
  },
} as ComponentMeta<typeof SwapDetail>;

export const Main = (props: PropTypes) => <SwapDetail {...props} swap={swap} />;
