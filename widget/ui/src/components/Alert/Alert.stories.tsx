import React from 'react';
import { Alert } from '.';
import { PropTypes } from './Alert';
import { Meta } from '@storybook/react';
import { Button } from '../Button';
// import { Typography } from '../Typography';

export default {
  title: 'Components/Alert',
  component: Alert,
  args: {
    type: 'success',
    title: 'Alert Title',
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

export const Main = (args: PropTypes) => (
  <Alert
    {...args}
    footer="It's a Alertlll!"
    action={
      <Button size="small" onClick={() => console.log(1111)}>
        BB
      </Button>
    }
  />
);
export const WithoutFooter = (args: PropTypes) => (
  <Alert
    {...args}
    action={
      <Button size="small" onClick={() => console.log(1111)}>
        AAA
      </Button>
    }
  />
);
