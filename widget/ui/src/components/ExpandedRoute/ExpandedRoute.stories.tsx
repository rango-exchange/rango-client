import type { Meta, StoryObj } from '@storybook/react';

import { ExpandedRoute } from './ExpandedRoute';
import { steps, tags } from './mock';

const meta: Meta<typeof ExpandedRoute> = {
  component: ExpandedRoute,
};

export default meta;
type Story = StoryObj<typeof ExpandedRoute>;

export const Main: Story = {
  args: {
    steps,
    tags,
    time: '11:30',
    fee: '16.46',
    warningLevel: 'low',
    percentageChange: '10',
    outputPrice: {
      realValue: '2.87978979879',
      realUsdValue: '23.65484879797',
      value: '2.5556484',
      usdValue: '23.564464',
    },
    selected: false,
  },
};
