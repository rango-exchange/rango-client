import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { Alert } from '.';
import { PropTypes } from './Alert';

export default {
  title: 'Alert',
  component: Alert,
  argTypes: {
    type: {
      defaultValue: 'success',
    },
    title: {
      defaultValue: 'Alert Title',
    },
    description: {
      defaultValue: 'Alert description ...',
    },
  },
} as ComponentMeta<typeof Alert>;

export const Main = (args: PropTypes) => <Alert {...args} />;
