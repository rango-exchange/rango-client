import React from 'react';
import { Meta } from '@storybook/react';
import { PropTypes, Radio } from './Radio';

export default {
  title: 'Components/Radio',
  component: Radio,
  args: {
    options: [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' },
      { value: 'three', label: 'Three' },
    ],
    direction: 'horizontal',
    defaultValue: 'one',
  },
  argTypes: {
    options: {
      defaultValue: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
        { value: 'three', label: 'Three' },
      ],
    },
  },
} as Meta<typeof Radio>;

export const Main = (args: PropTypes) => <Radio {...args} />;
