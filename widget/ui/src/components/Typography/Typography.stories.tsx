import React from 'react';
import { ComponentMeta } from '@storybook/react';

import Typography, { PropTypes } from './Typography';

export default {
  title: 'Typography',
  component: Typography,
  argTypes: {
    variant: {
      name: 'Variant',
      control: { type: 'select' },
      options: ['body1', 'body2', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      defaultValue: 'h1',
    },
    align: {
      name: 'Align',
      control: { type: 'select' },
      options: ['center', 'left', 'right'],
    },
    noWrap: {
      name: 'noWrap',
      control: { type: 'boolean' },
    },
  },
} as ComponentMeta<typeof Typography>;

export const Main = (props: PropTypes) => (
  <Typography {...props}>For typography test</Typography>
);
