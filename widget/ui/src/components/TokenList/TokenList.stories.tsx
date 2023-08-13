import type { PropTypes } from './TokenList.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { tokensMeta } from './mockData';
import { TokenList } from './TokenList';

export default {
  title: 'Components/Token List',
  component: TokenList,
  argTypes: {
    searchedText: {
      defaultValue: '',
    },
  },
} as Meta<typeof TokenList>;

export const Main = (args: PropTypes) => (
  <TokenList {...args} list={tokensMeta} selected={tokensMeta[0]} />
);
