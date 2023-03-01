import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { Select, PropTypes } from './Select';
import { blockchainMeta } from '../BlockchainsList/mockData';

export default {
  title: 'Components/Select',
  component: Select,
} as ComponentMeta<typeof Select>;

export const Main = (props: PropTypes) => (
  <Select {...props} list={blockchainMeta} selectItem={{
    value:'BSC',
    image:'https://api.rango.exchange/blockchains/binance.svg'
  }} />
);
