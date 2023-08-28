import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

import { CollapsibleMessageBox } from './CollapsibleMessageBox';

const meta: Meta<typeof CollapsibleMessageBox> = {
  component: CollapsibleMessageBox,
};

export default meta;
type Story = StoryObj<typeof CollapsibleMessageBox>;

export const Main: Story = {
  args: {
    status: 'warning',
    title: 'Title',
    description: 'This is a test text',
    children: <div>test</div>,
  },
};
