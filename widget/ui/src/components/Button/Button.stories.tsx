import React from 'react';
import { Meta } from '@storybook/react';

import { Button, PropTypes } from './Button';
import { AddWalletIcon } from '../Icon';

export default {
  title: 'Components/Button',
  component: Button,
  args: {
    variant: 'contained',
    size: 'medium',
    type: 'primary',
  },
  argTypes: {
    variant: {
      name: 'variant',
      control: { type: 'select' },
      options: ['contained', 'outlined', 'ghost'],
      defaultValue: 'contained',
    },
    type: {
      name: 'type',
      control: { type: 'select' },
      options: ['primary', 'error', 'warning', 'success'],
    },
    align: {
      name: 'align',
      control: { type: 'select' },
      options: ['start', 'grow'],
    },
    size: {
      name: 'size',
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'compact'],
      defaultValue: 'medium',
    },
    disabled: {
      name: 'disabled',
      control: { type: 'boolean' },
    },
  },
} as Meta<typeof Button>;

export const Main = (props: PropTypes) => (
  <Button {...props}>I'm a button</Button>
);

export const WithPrefix = (args: PropTypes) => (
  <Button prefix={<AddWalletIcon size={24} color="white" />} {...args}>
    I'm a button
  </Button>
);

export const WithSuffix = (args: PropTypes) => (
  <Button suffix={<AddWalletIcon size={24} color="white" />} {...args}>
    I'm a button
  </Button>
);
export const IconButton = (args: PropTypes) => (
  <div>
    <Button suffix={<AddWalletIcon size={24} color="white" />} {...args} />
  </div>
);
