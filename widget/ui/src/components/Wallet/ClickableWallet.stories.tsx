import type { Meta, StoryObj } from '@storybook/react';

import { Wallet } from './Wallet';
import { WalletState } from './Wallet.types';

const meta: Meta<typeof Wallet> = {
  component: Wallet,
};

export default meta;
type Story = StoryObj<typeof Wallet>;

export const Main: Story = {
  args: {
    title: 'Trust Wallet',
    image: 'https://api.rango.exchange/blockchains/zksync.png',
    onClick: (type) => {
      console.log('Clicked on', type);
    },
    type: 'wallet-connect-2',
    state: WalletState.CONNECTED,
  },
};
