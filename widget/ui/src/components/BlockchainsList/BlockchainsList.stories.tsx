import React from 'react';
import { Meta } from '@storybook/react';
import { BlockchainsList, PropTypes } from './BlockchainsList';
import { blockchainMeta } from './mockData';

export default {
  title: 'Components/Blockchains List',
  component: BlockchainsList,
  args: {
    searchedText: '',
  },
  argTypes: {
    searchedText: {
      type: 'string',
      defaultValue: '',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
      control: {
        type: 'text',
      },
    },
  },
} as Meta<typeof BlockchainsList>;

export const Main = (args: PropTypes) => {
  return (
    <BlockchainsList
      {...args}
      list={blockchainMeta}
      selected={blockchainMeta[0]}
    />
  );
};
