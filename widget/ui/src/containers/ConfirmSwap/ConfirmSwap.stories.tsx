import React from 'react';
import { Meta } from '@storybook/react';
import { ConfirmSwap, PropTypes } from './ConfirmSwap';
import { exampleFor5Wallets, wallets } from './mock';

export default {
  title: 'Containers/ConfirmSwap',
  component: ConfirmSwap,
  argTypes: {
    requiredWallets: {
      defaultValue: ['BSC', 'OSMOSIS'],
    },
  },
} as Meta<typeof ConfirmSwap>;

export const Main = (props: PropTypes) => (
  <ConfirmSwap {...props} selectableWallets={wallets} />
);

export const With5Wallets = (props: PropTypes) => (
  <ConfirmSwap {...props} selectableWallets={exampleFor5Wallets} />
);
