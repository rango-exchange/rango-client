import React from 'react';
import { Meta } from '@storybook/react';

import { SwapContainer, PropTypes } from './SwapContainer';

export default {
  title: 'Components/Swap Box',
  component: SwapContainer,
} as Meta<typeof SwapContainer>;

export const Main = (args: PropTypes) => (
  <SwapContainer {...args}></SwapContainer>
);
