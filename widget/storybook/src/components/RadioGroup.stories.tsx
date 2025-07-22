import type { RadioGroupPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { RadioGroup } from '@arlert-dev/ui';
import React from 'react';

export default {
  title: 'Components/RadioGroup',
  component: RadioGroup,
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
    direction: {
      options: ['vertical', 'horizontal'],
      control: { type: 'radio' },
      description: 'vertical | horizontal | undefined',
      type: 'string',
    },
    onChange: {
      type: 'function',
    },
  },
} as Meta<typeof RadioGroup>;

export const Main = (args: RadioGroupPropTypes) => <RadioGroup {...args} />;
