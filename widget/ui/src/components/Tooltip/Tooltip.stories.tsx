import type { PropTypes } from './Tooltip.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { AddWalletIcon } from '../Icon';

import { Tooltip } from './Tooltip';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    content: 'I am a tooltip',
    side: 'top',
  },
  argTypes: {
    content: {
      name: 'content',
      control: { type: 'text' },
      defaultValue: 'I am a tooltip',
    },
    side: {
      name: 'side',
      control: { type: 'select' },
      options: ['top', 'right', 'bottom', 'left'],
      defaultValue: 'top',
    },
    color: {
      name: 'color',
      control: { type: 'select' },
      options: ['primary', 'error', 'warning', 'success'],
    },
  },
} as Meta<typeof Tooltip>;

export const Main = (props: PropTypes) => (
  <div>
    <Tooltip {...props}>
      <AddWalletIcon size={24} />
    </Tooltip>
  </div>
);
