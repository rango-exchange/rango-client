import type { CheckboxPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { Checkbox } from '@arlert-dev/ui';
import React from 'react';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: {
    label: 'I am a checkbox',
    defaultChecked: true,
  },
  argTypes: {
    id: {
      control: { type: 'text' },
      type: 'string',
    },
    label: {
      control: { type: 'text' },
      defaultValue: 'I am a checkbox',
    },
    defaultChecked: {
      control: { type: 'boolean' },
      defaultValue: true,
      type: 'boolean',
    },
    checked: {
      control: { type: 'boolean' },
      type: 'boolean',
    },
    disabled: {
      control: { type: 'boolean' },
      type: 'boolean',
    },
    name: {
      control: { type: 'text' },
      type: 'string',
    },
    onCheckedChange: {
      type: 'function',
    },
  },
};

export default meta;

export const Main = (props: CheckboxPropTypes) => (
  <Checkbox id="test" label="My checkbox" {...props} />
);
