import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { PropTypes, SwapHistory } from './SwapHistory';
import { bestRoute } from '../ConfirmSwap/mock';

export default {
  title: 'Swap History',
  component: SwapHistory,
} as ComponentMeta<typeof SwapHistory>;

export const Main = (args: PropTypes) => (
  <SwapHistory {...args} bestRoute={bestRoute} />
);
