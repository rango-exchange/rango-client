import type { Meta, StoryObj } from '@storybook/react';

import { Alert, StepDetails } from '@arlert-dev/ui';
import React from 'react';

import { step1 } from './mock';

const meta: Meta<typeof StepDetails> = {
  component: StepDetails,
};

export default meta;
type Story = StoryObj<typeof StepDetails>;

export const Main: Story = {
  args: {
    step: { ...step1, alerts: <Alert title="test alert" type="warning" /> },
    type: 'swap-progress',
    state: 'completed',
  },

  argTypes: {
    type: {
      options: ['quote-details', 'swap-progress'],
      control: { type: 'radio' },
      description: 'quote-details | swap-progress',
      type: 'string',
    },
    hasSeparator: {
      control: { type: 'boolean' },
      type: 'boolean',
    },
    state: {
      options: ['default', 'in-progress', 'completed', 'warning', 'error'],
      control: { type: 'select' },
      description:
        'default | in-progress | completed | warning | error | undefined',
      type: 'string',
    },
    isFocused: {
      control: { type: 'boolean' },
      type: 'boolean',
    },
    tabIndex: {
      control: { type: 'number' },
      type: 'number',
    },
  },
};
