import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { Header, PropTypes } from './Header';

export default { name: 'Header', component: Header } as ComponentMeta<
  typeof Header
>;

export const Main = (args: PropTypes) => <Header title="Header" {...args} />;
