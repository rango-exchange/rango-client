import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { MultiSelect, PropTypes } from './MultiSelect';
import { blockchainMeta } from '../BlockchainsList/mockData';

export default {
  title: 'Components/MultiSelect',
  component: MultiSelect,
} as ComponentMeta<typeof MultiSelect>;

export const Main = (props: PropTypes) => (
  <MultiSelect {...props} list={blockchainMeta} type="Blockchains" />
);
