import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { BlockchainSelector, PropTypes } from './BlockchainSelector';
import { blockchainMeta } from '../BlockchainsList/mockData';
import { SwapContainer } from '../SwapContainer/SwapContainer';

export default {
  title: 'Blockchain Selector',
  component: BlockchainSelector,
  argTypes: {
    type: {
      defaultValue: 'Source',
    },
  },
} as ComponentMeta<typeof BlockchainSelector>;

export const Main = (args: PropTypes) => (
  <SwapContainer>
    <BlockchainSelector
      {...args}
      list={blockchainMeta}
      selected={blockchainMeta[0]}
    />
  </SwapContainer>
);
