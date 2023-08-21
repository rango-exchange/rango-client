import type { Meta, StoryObj } from '@storybook/react';

import { MessageBox } from './DefaultMessageBox';

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
};
