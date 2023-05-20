import React from 'react';
import { Meta } from '@storybook/react';

import { Chip, PropTypes } from './Chip';

export default {
  title: 'Components/Chip',
  component: Chip,
  args: {
    label: 'chip',
    selected: true,
  },
  argTypes: {
    label: {
      name: 'label',
      defaultValue: 'chip',
      control: {
        type: 'text',
      },
    },
    selected: {
      name: 'selected',
      control: { type: 'boolean' },
      defaultValue: true,
    },
  },
} as Meta<typeof Chip>;

export const Main = (args: PropTypes) => <Chip {...args} />;

export const ChipWithPrefix = (args: PropTypes) => (
  <Chip
    {...args}
    prefix={
      <img
        src="https://api.rango.exchange/blockchains/binance.svg"
        style={{ width: '20px' }}
      />
    }
  />
);

export const ChipWithSuffix = (args: PropTypes) => (
  <Chip
    {...args}
    suffix={
      <img
        src="	https://api.rango.exchange/blockchains/binance.svg"
        style={{ width: '20px' }}
      />
    }
  />
);
