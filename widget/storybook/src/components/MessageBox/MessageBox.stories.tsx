import type { Meta, StoryObj } from '@storybook/react';

import { MessageBox } from '@arlert-dev/ui';

const meta: Meta<typeof MessageBox> = {
  component: MessageBox,
};

export default meta;
type Story = StoryObj<typeof MessageBox>;

export const Main: Story = {
  args: {
    type: 'warning',
    title: 'Title',
    description: 'This is a test text',
  },
  argTypes: {
    type: {
      options: ['info', 'error', 'warning', 'success', 'loading'],
      control: { type: 'select' },
      description: 'info | error | warning | success | loading',
      type: 'string',
    },
  },
};
