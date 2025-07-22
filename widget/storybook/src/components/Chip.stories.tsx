import type { ChipPropTypes } from '@arlert-dev/ui';

import { Chip } from '@arlert-dev/ui';
import React from 'react';

export default {
  title: 'Components/Chip',
  component: Chip,
  args: {
    label: 'chip',
    selected: true,
    style: {},
    prefix: <></>,
    suffix: <></>,
  },
  argTypes: {
    label: {
      defaultValue: 'chip',
      control: {
        type: 'text',
      },
    },
    selected: {
      control: { type: 'boolean' },
      defaultValue: true,
    },
    className: {
      type: 'string',
    },
  },
};

export const Main = (args: ChipPropTypes) => <Chip {...args} />;

export const ChipWithPrefix = (args: ChipPropTypes) => (
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

export const ChipWithSuffix = (args: ChipPropTypes) => (
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
