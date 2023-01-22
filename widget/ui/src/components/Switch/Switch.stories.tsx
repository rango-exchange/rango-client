import { ComponentMeta } from '@storybook/react';
import React from 'react';
import Switch, { PropTypes } from './Switch';

export default { title: 'Switch', component: Switch } as ComponentMeta<
  typeof Switch
>;

export const Main = (args: PropTypes) => <Switch {...args} />;
