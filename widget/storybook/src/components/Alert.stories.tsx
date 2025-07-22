import type { AlertPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { Alert, Divider } from '@arlert-dev/ui';
import React from 'react';

export default {
  title: 'Components/Alert',
  component: Alert,
  args: {
    type: 'success',
    variant: 'alarm',
    title: 'Alert title',
    titleAlign: 'left',
    containerStyles: {},
    action: <></>,
  },
  argTypes: {
    type: {
      options: ['success', 'warning', 'error', 'info'],
      control: { type: 'select' },
      description: 'An necessary parameter designating the kind of alert.',
    },
    variant: {
      name: 'variant',
      options: ['alarm', 'regular'],
      control: { type: 'radio' },
      description: 'The alert UI model is specified by this parameter.',
    },
    title: {
      control: { type: 'text' },
    },
    titleAlign: {
      options: ['left', 'center', 'right'],
      control: { type: 'select' },
      description: 'specifies the title alignment',
    },

    footer: {
      control: { type: 'text' },
      description:
        'You can add a footer to the alert for more information, that it accepts a string or a React node.',
    },
  },
} as Meta<typeof Alert>;

export const Main = (args: AlertPropTypes) => (
  <div style={{ width: 350 }}>
    <Alert {...args} footer="This is the test footer." />
  </div>
);

export const RegularAlert = (args: AlertPropTypes) => (
  <div style={{ width: 350 }}>
    <Alert {...args} variant="regular" />
  </div>
);

export const Types = (args: AlertPropTypes) => (
  <div style={{ width: 350 }}>
    <Alert
      {...args}
      type="success"
      footer="Success lorem ipsum dolor sit text link amet"
    />
    <Divider size={12} />
    <Alert
      {...args}
      type="warning"
      footer="Warning lorem ipsum dolor sit text link amet"
    />
    <Divider size={12} />
    <Alert
      {...args}
      type="error"
      footer="Error lorem ipsum dolor sit text link amet"
    />
    <Divider size={12} />
    <Alert
      {...args}
      type="info"
      footer="Info lorem ipsum dolor sit text link amet"
    />
    <Divider size={12} />
    <Alert
      {...args}
      type="loading"
      footer="Loading lorem ipsum dolor sit text link amet"
    />
    <Divider size={12} />
  </div>
);
