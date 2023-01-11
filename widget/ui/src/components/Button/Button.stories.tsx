import React from 'react';
import { ComponentMeta } from '@storybook/react';

import Button, { PropTypes } from './Button';
import { AddWallet } from '../Icon';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    variant: {
      name: 'variant',
      control: { type: 'select' },
      options: ['contained', 'outlined', 'text'],
      defaultValue: 'contained',
    },
    fullWidth: {
      name: 'fullWidth',
      control: { type: 'boolean' },
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

export const ButtonWithIcon = (props: PropTypes) => (
  <div>
    <Button startIcon={<AddWallet size={24} />} {...props}>
      I'm a button
    </Button>
    <div style={{ margin: '10px 0' }} />
    <Button endIcon={<AddWallet size={24} />} {...props}>
      I'm a button
    </Button>
  </div>
);
