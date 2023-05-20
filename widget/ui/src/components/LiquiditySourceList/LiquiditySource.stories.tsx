import React from 'react';
import { Meta } from '@storybook/react';
import { LiquiditySourceList, PropTypes } from './LiquiditySourceList';
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
