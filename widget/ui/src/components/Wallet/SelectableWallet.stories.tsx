import type { Meta, StoryObj } from '@storybook/react';

import { SelectableWallet } from './SelectableWallet';

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
    type: 'wallet-connect-2',
  },
};
