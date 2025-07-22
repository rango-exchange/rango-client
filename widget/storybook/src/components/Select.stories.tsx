import type { SelectPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { Select } from '@arlert-dev/ui';
import React, { useState } from 'react';

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
  argTypes: {
    variant: {
      options: ['filled', 'outlined'],
      control: { type: 'radio' },
      description: 'filled | outlined',
      type: 'string',
    },
    handleItemClick: {
      type: 'function',
    },
  },
} as Meta<typeof Select>;

export const Main = (args: SelectPropTypes<string>) => {
  const [value, setValue] = useState<string>(args.value);
  return (
    <Select
      {...args}
      value={value}
      handleItemClick={(item) => setValue(item.value)}
    />
  );
};
