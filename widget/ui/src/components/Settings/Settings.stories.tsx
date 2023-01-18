import React from 'react';
import { ComponentMeta } from '@storybook/react';
import Settings, { PropTypes } from './Settings';
import SwapContainer from '../SwapContainer/SwapContainer';

export default {
  title: 'Settings',
  component: Settings,
  argTypes: {
    slippages: {
      defaultValue: ['0.5%', '1%', '3%', '5%', '8%', '13%', '20%'],
    },
    selectedSlippage: { defaultValue: '3%' },
    totalLiquiditySources: {
      defaultValue: 49,
    },
    selectedLiquiditySources: {
      defaultValue: 40,
    },
  },
} as ComponentMeta<typeof Settings>;

export const Main = (args: PropTypes) => (
  <SwapContainer>
    <Settings {...args} />
  </SwapContainer>
);
