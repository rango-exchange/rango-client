import type { PropTypes } from './SecondaryPage';
import type { Meta } from '@storybook/react';

import React from 'react';

import { SecondaryPage } from './SecondaryPage';

export default {
  title: 'Components/Secondary Page (Deprecated)',
  component: SecondaryPage,
  args: {
    textField: true,
    textFieldPlaceholder: 'Search',
    title: 'Secondary Page',
  },
} as Meta<typeof SecondaryPage>;

export const Main = (args: PropTypes) => <SecondaryPage {...args} />;
