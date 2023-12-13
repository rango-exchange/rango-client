import type { PropTypes } from './SwapHistory';
import type { Meta } from '@storybook/react';

import React from 'react';

import { pendingSwap } from './mock';
import { SwapHistory } from './SwapHistory';

export default {
  title: 'Containers/Swap History',
  component: SwapHistory,
} as Meta<typeof SwapHistory>;

export const Main = (args: PropTypes) => (
  <SwapHistory {...args} pendingSwap={pendingSwap} />
);
