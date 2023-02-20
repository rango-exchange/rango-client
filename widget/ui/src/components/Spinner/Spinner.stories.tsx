import { ComponentMeta } from '@storybook/react';
import React from 'react';
import { Spinner, PropTypes } from './Spinner';

export default {
  title: 'Components/Spinner',
  component: Spinner,
  argTypes: {
    color: {
      name: 'color',
      control: { type: 'select' },
      options: ['primary', 'error', 'warning', 'success', 'black', 'white'],
      defaultValue: 'primary',
    },

    size: {
      name: 'size',
      control: { type: 'radio' },
      options: [16, 20, 24],
      defaultValue: 16,
    },
  },
} as ComponentMeta<typeof Spinner>;

export const Main = (props: PropTypes) => <Spinner {...props} />;
