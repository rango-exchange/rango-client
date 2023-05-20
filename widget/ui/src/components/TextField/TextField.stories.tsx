import React from 'react';
import { Meta } from '@storybook/react';

import { TextField, PropTypes } from './TextField';
import { SearchIcon } from '../Icon';

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
} as Meta<typeof TextField>;

export const Main = (args: PropTypes) => <TextField {...args} />;

export const WithPrefix = (args: PropTypes) => (
  <TextField {...args} prefix={<SearchIcon size={20} />} />
);

export const WithSuffix = (args: PropTypes) => (
  <TextField {...args} suffix={<SearchIcon size={20} />} />
);
