import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

import { Alert } from '../Alert';

import { step1 } from './mock';
import { StepDetails } from './StepDetails';

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
};
