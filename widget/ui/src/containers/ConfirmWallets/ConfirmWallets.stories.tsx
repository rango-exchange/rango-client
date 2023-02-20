import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { ConfirmWallets, PropTypes } from './ConfirmWallets';
import { bestRoute, exampleFor5Wallets, wallets } from './mock';

export default {
  title: 'Containers/ConfirmWallets',
  component: ConfirmWallets,
  argTypes: {
    requiredWallets: {
      defaultValue: ['BSC', 'OSMOSIS'],
    },
  },
} as ComponentMeta<typeof ConfirmWallets>;

export const Main = (props: PropTypes) => (
  <ConfirmWallets {...props} swap={bestRoute} selectableWallets={wallets} />
);

export const With5Wallets = (props: PropTypes) => (
  <ConfirmWallets
    {...props}
    swap={bestRoute}
    selectableWallets={exampleFor5Wallets}
  />
);
