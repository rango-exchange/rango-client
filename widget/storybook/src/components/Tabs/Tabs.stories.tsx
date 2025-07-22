import type { TabsPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { Tabs } from '@arlert-dev/ui';
import React, { useState } from 'react';

import { numbers, themes } from './mock';

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
      options: ['primary', 'secondary', 'bordered'],
      defaultValue: 'primary',
      description: 'primary | secondary | bordered | undefined',
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
    scrollable: {
      defaultValue: false,
      type: 'boolean',
    },
    scrollButtons: {
      defaultValue: true,
      type: 'boolean',
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

export const Scrollable = (args: TabsPropTypes) => {
  const [value, setValue] = useState(numbers[0].id);

  return (
    <div
      style={{
        width: '250px',
        height: '40px',
      }}>
      <Tabs
        {...args}
        items={numbers}
        scrollable={true}
        type="bordered"
        value={value as string}
        onChange={(item) => setValue(item.id as string)}
      />
    </div>
  );
};
