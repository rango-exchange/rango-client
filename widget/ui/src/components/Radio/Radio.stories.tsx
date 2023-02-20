import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { PropTypes, Radio } from './Radio';

export default {
  title: 'Radio',
  component: Radio,
  argTypes: {
    options: {
      defaultValue: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
        { value: 'three', label: 'Three' },
      ],
    },
    defaultValue: { defaultValue: 'one' },
    direction: {
      defaultValue: 'horizontal',
    },
  },
} as ComponentMeta<typeof Radio>;

export const Main = (args: PropTypes) => <Radio {...args} />;
