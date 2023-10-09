import type { PropTypes } from './Radio.types';
import type { Meta } from '@storybook/react';

import { Root as RadioRoot } from '@radix-ui/react-radio-group';
import React from 'react';

import { Radio } from './Radio';

export default {
  title: 'Components/Radio',
  component: Radio,
  args: {
    value: 'test',
  },
} as Meta<typeof Radio>;

export const Main = (args: PropTypes) => (
  <RadioRoot>
    <Radio {...args} />
  </RadioRoot>
);
