import React from 'react';
import { ComponentMeta } from '@storybook/react';

import WalletChip, { PropTypes } from './WalletChip';
import { WalletState } from '../../types/wallet';

export default {
  title: 'Wallet chip',
  component: WalletChip,
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
    isDisabled: {
      name: 'isDisabled',
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
} as ComponentMeta<typeof WalletChip>;

export const Main = (args: PropTypes) => <WalletChip {...args}></WalletChip>;
