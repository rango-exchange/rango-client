import React from 'react';
import { ComponentMeta } from '@storybook/react';

import AddWallet, { PropTypes } from './AddWallet';

export default {
  title: 'Icons',
  component: AddWallet,
} as ComponentMeta<typeof AddWallet>;

export const Main = (props: PropTypes) => <AddWallet {...props} />;
