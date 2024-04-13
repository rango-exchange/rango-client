import type { PropTypes } from './Switch.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { Switch } from './Switch';

export default { title: 'Components/Switch', component: Switch } as Meta<
  typeof Switch
>;

export const Main = (args: PropTypes) => <Switch {...args} />;
