import type { Meta, StoryObj } from '@storybook/react';

import { CollapsibleMessageBox, Typography } from '@arlert-dev/ui';
import React from 'react';

const meta: Meta<typeof CollapsibleMessageBox> = {
  component: CollapsibleMessageBox,
  argTypes: {
    status: {
      options: ['info', 'error', 'warning', 'success', 'loading'],
      control: { type: 'select' },
      description: 'info | error | warning | success | loading | undefined',
      type: 'string',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CollapsibleMessageBox>;

export const Main: Story = {
  args: {
    status: 'warning',
    title: 'Title',
    description: 'This is a test text',
    children: (
      <Typography variant="body" size="medium">
        test
      </Typography>
    ),
  },
};
