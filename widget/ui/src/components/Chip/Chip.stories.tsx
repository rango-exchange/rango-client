import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { Chip, PropTypes } from './Chip';

export default {
  title: 'Chip',
  component: Chip,
} as ComponentMeta<typeof Chip>;

export const Main = (args: PropTypes) => <Chip {...args} label="chip" />;

export const ChipWithPrefix = (args: PropTypes) => (
  <Chip
    {...args}
    label="chip"
    prefix={
      <img
        src="	https://api.rango.exchange/blockchains/binance.svg"
        style={{ width: '20px' }}
      />
    }
  />
);

export const ChipWithSuffix = (args: PropTypes) => (
  <Chip
    {...args}
    label="chip"
    suffix={
      <img
        src="	https://api.rango.exchange/blockchains/binance.svg"
        style={{ width: '20px' }}
      />
    }
  />
);
