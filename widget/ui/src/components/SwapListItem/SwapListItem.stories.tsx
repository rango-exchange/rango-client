import type { PropTypes } from './SwapListItem.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { swap, swapTokenData } from './mock';
import { SwapListItem } from './SwapListItem';

export default {
  title: 'Components/Swap List Item',
  component: SwapListItem,
  args: {
    status: 'running',
  },
  argTypes: {
    status: {
      name: 'status',
      control: { type: 'select' },
      options: ['running', 'failed', 'success'],
      defaultValue: 'running',
    },
  },
} as Meta<typeof SwapListItem>;

export const Main = (props: PropTypes) => (
  <SwapListItem
    {...props}
    requestId={swap.requestId}
    creationTime={swap.creationTime}
    swapTokenData={swapTokenData}
  />
);
