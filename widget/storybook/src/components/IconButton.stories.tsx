import type { IconButtonPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { IconButton, WalletIcon } from '@arlert-dev/ui';
import React from 'react';

const meta: Meta<typeof IconButton> = {
  component: IconButton,
  args: {
    style: {},
  },
  argTypes: {
    size: {
      options: ['medium', 'small', 'xxsmall', 'xsmall', 'large'],
      control: { type: 'select' },
      description: 'medium | small | xxsmall | xsmall | large | undefined',
      type: 'string',
    },
    variant: {
      name: 'variant',
      options: ['contained', 'outlined', 'ghost', 'default'],
      control: { type: 'select' },
      description: 'contained | outlined | ghost | default | undefined',
      type: 'string',
    },
    type: {
      options: ['primary', 'secondary', 'error', 'warning', 'success'],
      control: { type: 'select' },
      description:
        'primary | secondary | error | warning | success | undefined',
      type: 'string',
    },
    onClick: {
      type: 'function',
    },
    loading: {
      control: { type: 'boolean' },
      type: 'boolean',
    },
    disabled: {
      control: { type: 'boolean' },
      type: 'boolean',
    },
  },
};

export default meta;

export const Main = (props: IconButtonPropTypes) => (
  <IconButton {...props}>
    <WalletIcon />
  </IconButton>
);
