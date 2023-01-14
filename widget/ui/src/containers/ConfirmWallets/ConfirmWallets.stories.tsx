import React from 'react';
import { ComponentMeta } from '@storybook/react';
import ConfirmWallets, { PropTypes } from './ConfirmWallets';
import { bestRoute, wallets } from './mock';

export default {
  title: 'Containers/ConfirmWallets',
  component: ConfirmWallets,
} as ComponentMeta<typeof ConfirmWallets>;

export const Main = (props: PropTypes) => (
  <div style={{ width: 516 }}>
    <ConfirmWallets {...props} bestRoute={bestRoute} wallets={wallets} />
  </div>
);
