import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { SwapContainer, PropTypes } from './SwapContainer';

export default {
  title: 'Components/Swap Box',
  component: SwapContainer,
} as ComponentMeta<typeof SwapContainer>;

export const Main = (args: PropTypes) => (
  <SwapContainer {...args}></SwapContainer>
);
