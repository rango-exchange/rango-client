import React from 'react';
import { Meta } from '@storybook/react';
import { Checkbox, PropTypes } from './Checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: {
    label: 'I am a checkbox',
    defaultChecked: true,
  },
  argTypes: {
    label: {
      name: 'label',
      control: { type: 'text' },
      defaultValue: 'I am a checkbox',
    },
    defaultChecked: {
      name: 'defaultChecked',
      control: { type: 'boolean' },
      defaultValue: true,
    },
  },
} as Meta<typeof Checkbox>;

export const Main = (props: PropTypes) => <Checkbox {...props} id="test" />;
