import React from 'react';
import { ComponentMeta } from '@storybook/react';
import TokenList, { PropTypes } from './TokenList';
import { tokensMeta } from './mockData';

export default {
  title: 'Token List',
  component: TokenList,
  argTypes: {
    searchedText: {
      defaultValue: '',
    },
  },
} as ComponentMeta<typeof TokenList>;

export const Main = (args: PropTypes) => (
  <TokenList {...args} list={tokensMeta} selected={tokensMeta[0]} />
);
