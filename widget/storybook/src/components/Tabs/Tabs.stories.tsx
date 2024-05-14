import type { TabsPropTypes } from '@rango-dev/ui';
import type { Meta } from '@storybook/react';

import { Tabs } from '@rango-dev/ui';
import React, { useState } from 'react';

import { themes } from './mock';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    type: 'primary',
    borderRadius: 'small',
    value: 'light',
    items: themes,
  },

  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
      defaultValue: 'primary',
      description: 'primary | secondary | undefined',
    },
    className: {
      control: { type: 'text' },
      type: 'string',
    },
    borderRadius: {
      control: { type: 'select' },
      options: ['medium', 'small', 'full'],
      defaultValue: 'small',
      description: 'medium | small | full | undefined',
    },
    onChange: {
      type: 'function',
    },
  },
} as Meta<typeof Tabs>;

export const Main = (args: TabsPropTypes) => {
  const [value, setValue] = useState(args.value);

  return (
    <div
      style={{
        width: '250px',
        height: '40px',
      }}>
      <Tabs
        {...args}
        value={value}
        onChange={(item) => setValue(item.id as string)}
      />
    </div>
  );
};
