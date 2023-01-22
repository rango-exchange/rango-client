import React from 'react';
import { ComponentMeta } from '@storybook/react';
import LiquiditySourcesSelector, {
  PropTypes,
} from './LiquiditySourcesSelector';
import { liquiditySources } from '../LiquiditySourceList/mockData';

export default {
  title: 'Liquidity Sources Selector',
  component: LiquiditySourcesSelector,
} as ComponentMeta<typeof LiquiditySourcesSelector>;

export const Main = (args: PropTypes) => (
  <LiquiditySourcesSelector {...args} list={liquiditySources} />
);
