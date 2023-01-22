import React from 'react';
import { ComponentMeta } from '@storybook/react';
import LiquiditySourceList, { PropTypes } from './LiquiditySourceList';
import { liquiditySources } from './mockData';

export default {
  title: 'Liquidity Source List',
  component: LiquiditySourceList,
} as ComponentMeta<typeof LiquiditySourceList>;

export const Main = (args: PropTypes) => (
  <LiquiditySourceList {...args} list={liquiditySources} />
);
