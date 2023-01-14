import React from 'react';
import { ComponentMeta } from '@storybook/react';

import RadioWalletGroup, { PropTypes } from './RadioWalletGroup';
import { data } from './mock';

export default {
  title: 'Components/RadioWalletGroup',
  component: RadioWalletGroup,
} as ComponentMeta<typeof RadioWalletGroup>;

export const Main = (props: PropTypes) => (
  <RadioWalletGroup {...props} wallet={data} />
);
