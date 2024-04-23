import type { PropTypes } from './Tabs.types';
import type { Meta } from '@storybook/react';

import React, { useState } from 'react';

import { styled } from '../../theme';

import { themes } from './mock';

import { Tabs } from '.';

export const TabsContainer = styled('div', {
  width: '250px',
  height: '$40',
});

export default {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    type: 'primary',
    borderRadius: 'small',
    value: 'light',
    items: themes,
  },
} as Meta<typeof Tabs>;

export const Main = (args: PropTypes) => {
  const [value, setValue] = useState(args.value);

  return (
    <TabsContainer>
      <Tabs
        {...args}
        value={value}
        onChange={(item) => setValue(item.id as string)}
      />
    </TabsContainer>
  );
};
