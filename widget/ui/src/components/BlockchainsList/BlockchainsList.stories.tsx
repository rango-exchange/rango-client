import type { PropTypes } from './BlockchainsList';
import type { Meta } from '@storybook/react';

import React from 'react';

import { BlockchainsList } from './BlockchainsList';
import { blockchainMeta } from './mockData';

export default {
  title: 'Components/Blockchains List (Deprecated)',
  component: BlockchainsList,
  args: {
    searchedText: '',
  },
  argTypes: {
    searchedText: {
      type: 'string',
      defaultValue: '',
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
