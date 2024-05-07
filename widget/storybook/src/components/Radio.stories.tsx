import type { RadioPropTypes } from '@rango-dev/ui';
import type { Meta } from '@storybook/react';

import { Root as RadioRoot } from '@radix-ui/react-radio-group';
import { Radio } from '@rango-dev/ui';
import React from 'react';

export default {
  title: 'Components/Radio',
  component: Radio,
  args: {
    value: 'test',
  },
} as Meta<typeof Radio>;

export const Main = (args: RadioPropTypes) => (
  <RadioRoot>
    <Radio {...args} />
  </RadioRoot>
);
