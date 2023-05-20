import React from 'react';
import { Meta } from '@storybook/react';
import { TokenSelector, PropTypes } from './TokenSelector';
import { tokensMeta } from '../../components/TokenList/mockData';

export default {
  title: 'Containers/Token Selector',
  component: TokenSelector,
  args: {
    type: 'Source',
    loadingStatus: 'success',
  },
} as Meta<typeof TokenSelector>;

export const Main = (args: PropTypes) => (
  <TokenSelector {...args} list={tokensMeta} selected={tokensMeta[0]} />
);
