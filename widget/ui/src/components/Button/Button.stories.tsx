import React from 'react';
import { ComponentMeta } from '@storybook/react';

import Button, { PropTypes } from './Button';
import AddWallet from '../Icon/AddWallet';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    variant: {
      name: 'Variant',
      control: { type: 'select' },
      options: ['contained', 'outlined', 'text'],
      defaultValue: 'contained',
    },
    fullWidth: {
      name: 'Full Width',
      control: { type: 'boolean' },
    },
    disabled: {
      name: 'Disabled',
      control: { type: 'boolean' },
    },
  },
} as ComponentMeta<typeof Button>;

export const Main = (props: PropTypes) => (
  <Button {...props}>I'm a button</Button>
);

export const ButtonWithIcon = (props: PropTypes) => (
  <div>
    <Button startIcon={<AddWallet />} {...props}>
      I'm a button
    </Button>
    <div style={{margin:'10px 0'}}/>
    <Button endIcon={<AddWallet />} {...props}>
      I'm a button
    </Button>
  </div>
);
