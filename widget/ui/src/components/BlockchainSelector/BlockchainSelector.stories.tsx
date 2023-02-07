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
  <SwapContainer onConnectWallet={() => {}}>
    <BlockchainSelector
      {...args}
      list={blockchainMeta as any}
      selected={blockchainMeta[0] as any}
    />
  </SwapContainer>
);
