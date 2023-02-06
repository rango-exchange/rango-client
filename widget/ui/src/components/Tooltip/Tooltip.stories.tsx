import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { Tooltip, PropTypes } from './Tooltip';
import { AddWalletIcon } from '../Icon';

export default {
  title: 'Components/Tooltip',
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
} as ComponentMeta<typeof Tooltip>;

export const Main = (props: PropTypes) => (
  <div
    style={{
      height: 300,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Tooltip {...props}>
      <AddWalletIcon size={24} />
    </Tooltip>
  </div>
);
