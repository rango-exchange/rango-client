import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

import { CollapsableMessageBox } from './CollapsableMessageBox';

const meta: Meta<typeof CollapsableMessageBox> = {
  component: CollapsableMessageBox,
};

export default meta;
type Story = StoryObj<typeof CollapsableMessageBox>;

export const Main: Story = {
  args: {
    status: 'warning',
    title: 'Title',
    description: 'This is a test text',
    children: <div>test</div>,
  },
};
