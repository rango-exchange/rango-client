import React from 'react';
import { ComponentMeta } from '@storybook/react';
import BlockchainsList, { PropTypes } from './BlockchainsList';
import { blockchainMeta } from './mockData';

export default {
  title: 'Blockchains List',
  component: BlockchainsList,
  argTypes: {
    searchedText: {
      type: 'string',
      defaultValue: '',
    },
  },
} as ComponentMeta<typeof BlockchainsList>;

export const Main = (args: PropTypes) => {
  return (
    <BlockchainsList
      {...args}
      list={blockchainMeta}
      selected={blockchainMeta[0]}
    />
  );
};
