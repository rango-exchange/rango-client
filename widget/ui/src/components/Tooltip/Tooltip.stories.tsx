import React from 'react';
import { ComponentMeta } from '@storybook/react';

import Tooltip, { PropTypes } from './Tooltip';
import { AddWallet } from '../Icon';

export default {
  title: 'Tooltip',
  component: Tooltip,
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
  },
} as ComponentMeta<typeof Tooltip>;

export const Main = (props: PropTypes) => (
  <Tooltip {...props}>
    <AddWallet />
  </Tooltip>
);
