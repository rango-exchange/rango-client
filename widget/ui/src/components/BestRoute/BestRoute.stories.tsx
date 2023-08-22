import type { Meta, StoryObj } from '@storybook/react';

import { BestRoute } from './BestRoute';
import { route1 } from './mock';

const meta: Meta<typeof BestRoute> = {
  component: BestRoute,
};

export default meta;
type Story = StoryObj<typeof BestRoute>;

export const Main: Story = {
  args: {
    ...route1,
  },
};
