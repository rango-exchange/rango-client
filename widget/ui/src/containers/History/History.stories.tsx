import React from 'react';
import { ComponentMeta } from '@storybook/react';

import History, { PropTypes } from './History';
import { mockData } from './MockData';

export default {
  title: 'Containers/History',
  component: History,
} as ComponentMeta<typeof History>;

export const Main = (props: PropTypes) => (
  <History {...props} swaps={mockData} />
);
