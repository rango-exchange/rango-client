import React from 'react';
import { ComponentMeta } from '@storybook/react';
import TokenSelector, { PropTypes } from './TokenSelector';
import { tokensMeta } from '../TokenList/mockData';

export default { title: 'Token Selector' } as ComponentMeta<
  typeof TokenSelector
>;

export const Main = (args: PropTypes) => (
  <TokenSelector {...args} tokens={tokensMeta} />
);
