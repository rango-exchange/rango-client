import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { PropTypes, Wallet } from './Wallet';
import { WalletState } from '../../types/wallet';

export default {
  title: 'Wallet chip',
  component: Wallet,
  argTypes: {
    title: {
      name: 'title',
      type: 'string',
      defaultValue: 'Coinbase',
    },
    image: {
      name: 'image',
      type: 'string',
      defaultValue: 'https://app.rango.exchange/wallets/coinbase.svg',
    },
    disabled: {
      name: 'disabled',
      type: 'boolean',
      defaultValue: false,
    },
    state: {
      name: 'wallet state',
      control: {
        type: 'select',
      },
      options: Object.values(WalletState),
    },
  },
} as ComponentMeta<typeof Wallet>;

export const Main = (args: PropTypes) => <Wallet {...args}></Wallet>;
