import React from 'react';
import { Meta } from '@storybook/react';
import {
  LiquiditySourcesSelector,
  PropTypes,
} from './LiquiditySourcesSelector';
import { liquiditySources } from '../../components/LiquiditySourceList/mockData';

export default {
  title: 'Containers/Liquidity Sources Selector',
  component: LiquiditySourcesSelector,
  args: {
    loadingStatus: 'success',
  },
} as Meta<typeof LiquiditySourcesSelector>;

export const Main = (args: PropTypes) => (
  <LiquiditySourcesSelector {...args} list={liquiditySources} />
);
