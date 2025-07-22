import type { TextFieldPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { SearchIcon, TextField } from '@arlert-dev/ui';
import React from 'react';

export default {
  title: 'Components/Text Field',

  component: TextField,

  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      type: 'boolean',
    },
    placeholder: {
      name: 'placeholder',
      control: { type: 'text' },
      type: 'string',
    },
    label: {
      name: 'placeholder',
      control: { type: 'text' },
      type: 'string',
    },
    variant: {
      control: { type: 'select' },
      options: ['contained', 'outlined', 'ghost'],
      description: 'contained | outlined | ghost | undefined',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'size'],
      description: 'small | size | undefined',
    },
    fullWidth: {
      type: 'boolean',
      control: { type: 'boolean' },
    },
  },
  args: {
    variant: 'contained',
    placeholder: 'test',
    fullWidth: false,
  },
} as Meta<typeof TextField>;

export const Main = (args: TextFieldPropTypes) => <TextField {...args} />;

export const WithPrefix = (args: TextFieldPropTypes) => (
  <TextField {...args} prefix={<SearchIcon size={20} color={'black'} />} />
);

export const WithSuffix = (args: TextFieldPropTypes) => (
  <TextField {...args} suffix={<SearchIcon size={20} color={'black'} />} />
);
