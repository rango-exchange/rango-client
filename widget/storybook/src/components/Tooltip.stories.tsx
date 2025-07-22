import type { TooltipPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { AddIcon, Tooltip } from '@arlert-dev/ui';
import React from 'react';

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

export const Main = (props: TooltipPropTypes) => (
  <div>
    <Tooltip {...props}>
      <AddIcon size={24} />
    </Tooltip>
  </div>
);
