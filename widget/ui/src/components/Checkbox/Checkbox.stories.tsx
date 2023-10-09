import type { PropTypes } from './Checkbox.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
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
};

export default meta;

export const Main = (props: PropTypes) => (
  <Checkbox id="test" label="My checkbox" {...props} />
);
