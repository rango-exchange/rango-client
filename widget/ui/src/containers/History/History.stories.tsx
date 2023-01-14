import React from 'react';
import { ComponentMeta } from '@storybook/react';

import History, { PropTypes } from './History';
import { pendingSwap } from './mock';

export default {
  title: 'Containers/History',
  component: History,
} as ComponentMeta<typeof History>;

export const Main = (props: PropTypes) => (
  <div style={{ width: 516 }}>
    <History {...props} swaps={pendingSwap} />
  </div>
);
