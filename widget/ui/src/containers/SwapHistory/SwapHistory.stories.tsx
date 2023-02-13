import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { PropTypes, SwapHistory } from './SwapHistory';
import { pendingSwap2 } from '../History/mock';

export default {
  title: 'Swap History',
  component: SwapHistory,
} as ComponentMeta<typeof SwapHistory>;

export const Main = (args: PropTypes) => (
  <SwapHistory {...args} pendingSwap={pendingSwap2} />
);
