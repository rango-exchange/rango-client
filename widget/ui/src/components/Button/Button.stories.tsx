import React from 'react';
import { ComponentMeta } from '@storybook/react';

import Button, { PropTypes } from './Button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    type: {
      name: 'type',
      control: { type: 'select' },
      options: ['primary', 'transparent'],
    },
  },
} as ComponentMeta<typeof Button>;

export const Main = (props: PropTypes) => (
  <Button {...props}>I'm a button</Button>
);
