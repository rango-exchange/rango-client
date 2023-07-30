import React from 'react';
import { Alert } from '.';
import { PropTypes } from './Alert';
import { Meta } from '@storybook/react';
import { Typography } from '../Typography';

export default {
  title: 'Components/Alert',
  component: Alert,
  args: {
    type: 'success',
    title: 'Alert Title',
    footer: (
      <Typography variant="body" size="large">
        It's a Alert!
      </Typography>
    ),
  },
  argTypes: {
    type: {
      name: 'type',
      defaultValue: 'success',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'success', 'warning', 'error'],
      },
    },

    title: {
      name: 'title',
      defaultValue: 'Alert Title',
      control: {
        type: 'text',
      },
    },
  },
} as Meta<typeof Alert>;

export const Main = (args: PropTypes) => <Alert {...args} />;
