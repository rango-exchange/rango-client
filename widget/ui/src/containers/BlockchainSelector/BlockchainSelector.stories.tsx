import React from 'react';
import { Meta } from '@storybook/react';
import { BlockchainSelector, PropTypes } from './BlockchainSelector';
import { blockchainMeta } from '../../components/BlockchainsList/mockData';
import { SwapContainer } from '../../components/SwapContainer/SwapContainer';

export default {
  title: 'Containers/Blockchain Selector',
  component: BlockchainSelector,
  args: {
    type: 'Source',
    loadingStatus: 'success',
  },
  argTypes: {
    type: {
      name: 'type',
      defaultValue: 'Source',
      control: {
        type: 'select',
        options: ['Source', 'Destination'],
      },
    },
    loadingStatus: {
      name: 'loadingStatus',
      control: {
        type: 'select',
        options: ['loading', 'success', 'failed'],
      },
    },
  },
} as Meta<typeof BlockchainSelector>;

export const Main = (args: PropTypes) => (
  <SwapContainer>
    <BlockchainSelector
      {...args}
      list={blockchainMeta}
      selected={blockchainMeta[0]}
    />
  </SwapContainer>
);
