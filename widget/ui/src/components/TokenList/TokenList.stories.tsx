import React from 'react';
import { ComponentMeta } from '@storybook/react';
import TokenList, { PropTypes } from './TokenList';

export default { title: 'Token List', component: TokenList } as ComponentMeta<
  typeof TokenList
>;

export const Main = (args: PropTypes) => <TokenList {...args} />;
