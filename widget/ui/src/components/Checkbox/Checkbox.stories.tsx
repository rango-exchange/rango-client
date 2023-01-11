import React from 'react';
import { ComponentMeta } from '@storybook/react';
import Checkbox, { PropTypes } from './Checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
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
} as ComponentMeta<typeof Checkbox>;

export const Main = (props: PropTypes) => <Checkbox {...props} id="test" />;
