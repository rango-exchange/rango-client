import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { SwapContainer } from './SwapContainer';

export default {
  title: 'Components/Swap Box',
  component: SwapContainer,
} as ComponentMeta<typeof SwapContainer>;

export const Main = () => <SwapContainer></SwapContainer>;
