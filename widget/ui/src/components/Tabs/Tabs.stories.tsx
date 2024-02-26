import type { PropTypes } from './Tabs.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { Tabs } from '.';

export default { title: 'Components/Tabs', component: Tabs } as Meta<
  typeof Tabs
>;

export const Main = (args: PropTypes) => <Tabs {...args} />;
