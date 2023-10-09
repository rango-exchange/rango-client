import { Meta } from '@storybook/react';
import React from 'react';
import { Switch } from './Switch';
import { PropTypes } from './Switch.types';

export default { title: 'Components/Switch', component: Switch } as Meta<
  typeof Switch
>;

export const Main = (args: PropTypes) => <Switch {...args} />;
