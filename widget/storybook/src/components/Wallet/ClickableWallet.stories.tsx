import type { Meta, StoryObj } from '@storybook/react';

import { Wallet, WalletState } from '@arlert-dev/ui';

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
  argTypes: {
    state: {
      options: [
        WalletState.CONNECTED,
        WalletState.CONNECTING,
        WalletState.DISCONNECTED,
        WalletState.NOT_INSTALLED,
      ],
      control: { type: 'select' },
      description: `${WalletState.CONNECTED} | ${WalletState.CONNECTING} | ${WalletState.DISCONNECTED} | ${WalletState.NOT_INSTALLED}`,
      type: 'string',
    },
  },
};
