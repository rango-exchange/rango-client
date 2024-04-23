import type { PropTypes } from './Select.types';
import type { Meta } from '@storybook/react';

import React, { useState } from 'react';

import { Select } from '.';

const options = [
  {
    label: 'Default',
    value: 'default',
  },
  {
    label: 'Expanded',
    value: 'expanded',
  },
  {
    label: 'Full Expanded',
    value: 'full-expanded',
  },
];
export default {
  title: 'Components/Select',
  component: Select,
  args: {
    variant: 'outlined',
    options,
    value: 'default',
  },
} as Meta<typeof Select>;

export const Main = (args: PropTypes<string>) => {
  const [value, setValue] = useState<string>(args.value);
  return (
    <Select
      {...args}
      value={value}
      handleItemClick={(item) => setValue(item.value)}
    />
  );
};
