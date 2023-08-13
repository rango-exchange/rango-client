import type { PropTypes } from './Alert.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { Alert } from '.';

export default {
  title: 'Components/Alert',
  component: Alert,
  args: {
    type: 'success',
    title: 'Please reset your liquidity sources.',
  },
  argTypes: {
    type: {
      name: 'type',
      defaultValue: 'success',
      control: {
        type: 'select',
        options: ['success', 'warning', 'error', 'info'],
      },
    },

    title: {
      name: 'title',
      defaultValue: 'Swap transaction successfully',
      control: {
        type: 'text',
      },
    },
  },
} as Meta<typeof Alert>;

export const Main = (args: PropTypes) => (
  <div style={{ width: 350 }}>
    <Alert
      {...args}
      footer="Transaction was not sent. 38.3493  AVAX on Avalanche remain in your wallet."
    />
  </div>
);
export const WithoutFooter = (args: PropTypes) => (
  <div style={{ width: 350 }}>
    <Alert {...args} variant="alarm" />
  </div>
);
