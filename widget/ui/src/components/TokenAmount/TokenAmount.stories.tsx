import type { Meta, StoryObj } from '@storybook/react';

import { TokenAmount } from './TokenAmount';

const meta: Meta<typeof TokenAmount> = {
  component: TokenAmount,
};

export default meta;
type Story = StoryObj<typeof TokenAmount>;

export const Main: Story = {
  args: {
    type: 'output',
    price: { value: '1', usdValue: '28,490' },
    percentageChange: '2.21',
    warningLevel: 'low',
  },
};
