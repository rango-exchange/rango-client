import React from 'react';
import { Meta } from '@storybook/react';

import { Tooltip, PropTypes } from './Tooltip';
import { AddWalletIcon } from '../Icon';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    content: 'I am a tooltip',
    side: 'top',
    color: 'gray',
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
      options: [
        'primary',
        'error',
        'warning',
        'success',
        'black',
        'white',
        'gray',
      ],
      defaultValue: 'gray',
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
