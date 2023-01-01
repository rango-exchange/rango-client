import React from 'react';
import { ComponentMeta } from '@storybook/react';

import Button, { PropTypes } from './Button';

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
  <Button startIcon={<div>start Icon</div>} endIcon={<div>end Icon</div>} {...props}>I'm a button</Button>
);
