import { Meta } from '@storybook/react';
import { PropTypes, SecondaryPage } from './SecondaryPage';
import React from 'react';

export default {
  title: 'Components/Secondary Page',
  component: SecondaryPage,
  args:{
    textField:true,
    textFieldPlaceholder:'Search',
    title:'Secondary Page'
  }
} as Meta<typeof SecondaryPage>;


export const Main = (args: PropTypes) => <SecondaryPage {...args} />;
