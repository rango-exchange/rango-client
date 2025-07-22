import type { Meta, StoryObj } from '@storybook/react';

import { SelectableWallet, WalletState } from '@arlert-dev/ui';

const meta: Meta<typeof SelectableWallet> = {
  component: SelectableWallet,
};

export default meta;
type Story = StoryObj<typeof SelectableWallet>;

export const Main: Story = {
  args: {
    title: 'Trust Wallet',
    description: '0x......',
    image: 'https://api.rango.exchange/blockchains/zksync.png',
    onClick: (type) => {
      console.log('Clicked on', type);
    },
    selected: true,
    state: WalletState.CONNECTED,
    type: 'wallet-connect-2',
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
