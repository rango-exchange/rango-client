import type { PropTypes } from './LiquiditySourceList.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { LiquiditySourceList } from './LiquiditySourceList';
import { liquiditySources } from './mockData';

export default {
  title: 'Components/Liquidity Source List',
  component: LiquiditySourceList,
  args: {
    loadingStatus: 'success',
  },
} as Meta<typeof LiquiditySourceList>;

export const Main = (args: PropTypes) => (
  <LiquiditySourceList {...args} list={liquiditySources} />
);
