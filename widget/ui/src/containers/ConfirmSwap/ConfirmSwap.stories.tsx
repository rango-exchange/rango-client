import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { ConfirmSwap, PropTypes } from './ConfirmSwap';
import { bestRoute } from './mock';

export default {
  title: 'Containers/ConfirmSwap',
  component: ConfirmSwap,
} as ComponentMeta<typeof ConfirmSwap>;

export const Main = (props: PropTypes) => (
  <ConfirmSwap {...props} bestRoute={bestRoute} />
);
