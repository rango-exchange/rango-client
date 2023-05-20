import React from 'react';
import { Meta } from '@storybook/react';
import { PropTypes, SwapHistory } from './SwapHistory';
import { pendingSwap } from './mock';

export default {
  title: 'Containers/Swap History',
  component: SwapHistory,
} as Meta<typeof SwapHistory>;

export const Main = (args: PropTypes) => (
  <SwapHistory {...args} pendingSwap={pendingSwap} />
);
