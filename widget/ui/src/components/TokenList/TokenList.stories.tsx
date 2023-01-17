import React from 'react';
import { ComponentMeta } from '@storybook/react';
import TokenList, { PropTypes } from './TokenList';
import { tokensMeta } from './mockData';

export default { title: 'Token List', component: TokenList } as ComponentMeta<
  typeof TokenList
>;

export const Main = (args: PropTypes) => (
  <TokenList {...args} tokens={tokensMeta} />
);
