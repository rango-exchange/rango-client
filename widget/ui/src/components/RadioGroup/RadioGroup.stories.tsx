import type { PropTypes } from './RadioGroup.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { RadioGroup } from './RadioGroup';

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
  },
} as Meta<typeof RadioGroup>;

export const Main = (args: PropTypes) => <RadioGroup {...args} />;
