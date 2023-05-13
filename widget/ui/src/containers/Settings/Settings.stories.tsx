import React from 'react';
import { Meta } from '@storybook/react';
import { Settings, PropTypes } from './Settings';
import { liquiditySources } from '../../components/LiquiditySourceList/mockData';
import { SwapContainer } from '../../components';

export default {
  title: 'Containers/Settings',
  component: Settings,
  args: {
    slippages: [0.5, 1, 3, 5, 8, 13, 20],
    selectedSlippage: 3,
    minSlippage: 1,
    maxSlippage: 10,
  },
} as Meta<typeof Settings>;


export const Main = (args: PropTypes) => (
  <SwapContainer>
    <Settings
      {...args}
      liquiditySources={liquiditySources}
      selectedLiquiditySources={liquiditySources.slice(0, 5)}
    />
  </SwapContainer>
);
