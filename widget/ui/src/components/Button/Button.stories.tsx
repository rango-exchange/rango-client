import React from 'react';
import { ComponentMeta } from '@storybook/react';

import Button, { PropTypes } from './Button';
import { AddWallet } from '../Icon';

export default {
  title: 'Components/Button',
  component: Button,
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
      defaultValue: 'primary',
    },
    align: {
      name: 'align',
      control: { type: 'select' },
      options: ['start', 'grow'],
    },
    size: {
      name: 'size',
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
      defaultValue: 'medium',
    },
    disabled: {
      name: 'disabled',
      control: { type: 'boolean' },
    },
  },
} as ComponentMeta<typeof Button>;

export const Main = (props: PropTypes) => (
  <Button {...props}>I'm a button</Button>
);

export const WithPrefix = (args: PropTypes) => (
  <Button prefix={<AddWallet size={24} color="white" />} {...args}>
    I'm a button
  </Button>
);

export const WithSuffix = (args: PropTypes) => (
  <Button suffix={<AddWallet size={24} color="white" />} {...args}>
    I'm a button
  </Button>
);
export const IconButton = (args: PropTypes) => (
  <div>
    <Button suffix={<AddWallet size={24} color="white" />} {...args} />
  </div>
);
