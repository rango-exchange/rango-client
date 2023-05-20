import React from 'react';
import { Meta } from '@storybook/react';

import { History, PropTypes } from './History';
import { pendingSwap } from './mock';

export default {
  title: 'Containers/History',
  component: History,
} as Meta<typeof History>;

export const Main = (props: PropTypes) => (
  <History {...props} list={pendingSwap} />
);
