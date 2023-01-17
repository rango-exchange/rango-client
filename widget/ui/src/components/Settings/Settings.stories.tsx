import React from 'react';
import { ComponentMeta } from '@storybook/react';
import Settings, { PropTypes } from './Settings';
import SwapContainer from '../SwapContainer/SwapContainer';

export default { title: 'Settings', component: Settings } as ComponentMeta<
  typeof Settings
>;

export const Main = (args: PropTypes) => (
  <SwapContainer>
    <Settings {...args} />
  </SwapContainer>
);
