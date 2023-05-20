import React from 'react';
import { Meta } from '@storybook/react';

import { PropTypes, Wallet } from './Wallet';
import { WalletState } from '../../types/wallet';

export default {
  title: 'Components/Wallet chip',
  component: Wallet,
  args: {
    name: 'Coinbase',
    image: 'https://app.rango.exchange/wallets/coinbase.svg',
  },
  argTypes: {
    image: {
      name: 'image',
      type: 'string',
      defaultValue: 'https://app.rango.exchange/wallets/coinbase.svg',
    },
    state: {
      name: 'wallet state',
      control: {
        type: 'select',
      },
      options: Object.values(WalletState),
    },
  },
} as Meta<typeof Wallet>;

export const Main = (args: PropTypes) => <Wallet {...args}></Wallet>;
