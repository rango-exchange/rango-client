import React from 'react';
import { ComponentMeta } from '@storybook/react';

import Chip, { PropTypes } from './Chip';
import { Cross2Icon } from '@radix-ui/react-icons';

export default {
  title: 'Chip',
  component: Chip,
  argTypes: {
    size: {
      name: 'size',
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      defaultValue: 'medium',
    },
    variant: {
      name: 'variant',
      control: { type: 'select' },
      options: ['outlined', 'contained'],
      defaultValue: 'contained',
    },
  },
} as ComponentMeta<typeof Chip>;

export const Main = (props: PropTypes) => (
  <Chip
    {...props}
    prefix={
      <img
        src="	https://api.rango.exchange/blockchains/binance.svg"
        style={{ width: '20px' }}
      />
    }
    suffix={<Cross2Icon />}
  ></Chip>
);
