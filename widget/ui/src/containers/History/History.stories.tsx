import React from 'react';
import { ComponentMeta } from '@storybook/react';

import History, { PropTypes } from './History';
import { pendingSwap } from './mock';
import SwapContainer from '../../components/SwapContainer';

export default {
  title: 'Containers/History',
  component: History,
} as ComponentMeta<typeof History>;

export const Main = (props: PropTypes) => (
  <SwapContainer>
    <History {...props} swaps={pendingSwap} />
  </SwapContainer>
);
