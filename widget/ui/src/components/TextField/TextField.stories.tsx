import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { TextField, PropTypes } from './TextField';
import { Search } from '../Icon';

export default {
  title: 'Components/Text Field',

  component: TextField,
  argTypes: {
    disabled: {
      name: 'disabled',
      type: 'boolean',
    },
    placeholder: {
      name: 'placeholder',
      type: 'string',
    },
  },
} as ComponentMeta<typeof TextField>;

export const Main = (args: PropTypes) => <TextField {...args} />;

export const WithPrefix = (args: PropTypes) => (
  <TextField {...args} prefix={<Search size={20} />} />
);

export const WithSuffix = (args: PropTypes) => (
  <TextField {...args} suffix={<Search size={20} />} />
);
