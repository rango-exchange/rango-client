import type { PropTypes } from './TextField.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { SearchIcon } from '../../icons';

import { TextField } from './TextField';

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
  args: {
    variant: 'contained',
    placeholder: 'test',
    fullWidth: false,
  },
} as Meta<typeof TextField>;

export const Main = (args: PropTypes) => <TextField {...args} />;

export const WithPrefix = (args: PropTypes) => (
  <TextField {...args} prefix={<SearchIcon size={20} color={'black'} />} />
);

export const WithSuffix = (args: PropTypes) => (
  <TextField {...args} suffix={<SearchIcon size={20} color={'black'} />} />
);
