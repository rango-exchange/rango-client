import type { PopoverPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import {
  AddIcon,
  Button,
  List,
  NotificationsIcon,
  Popover,
} from '@arlert-dev/ui';
import React from 'react';

function PopoverContent() {
  return (
    <div style={{ width: '300px' }}>
      <div>I'm a Popover</div>
      <List
        items={[
          { id: 'one', title: 'one' },
          { id: 'two', title: 'two' },
          { id: 'three', title: 'three' },
          { id: 'four', title: 'four' },
        ]}
      />
    </div>
  );
}

export default {
  title: 'Components/Popover',
  component: Popover,
  args: {
    content: <PopoverContent />,
    side: 'bottom',
  },
  argTypes: {
    content: {
      control: { type: 'component' },
      defaultValue: null,
    },
    side: {
      control: { type: 'select' },
      options: ['top', 'right', 'bottom', 'left'],
      defaultValue: 'bottom',
      description: 'top | right | bottom | left | undefined',
      type: 'string',
    },
    align: {
      control: { type: 'select' },
      options: ['center', 'start', 'end'],
      description: 'center | start | end | undefined',
      type: 'string',
    },
    sideOffset: {
      control: { type: 'number' },
      type: 'number',
    },
    alignOffset: {
      control: { type: 'number' },
      type: 'number',
    },
    collisionPadding: {
      control: { type: 'number' },
      type: 'number',
    },
    hasArrow: {
      control: { type: 'boolean' },
      type: 'boolean',
    },
    onOpenChange: {
      type: 'function',
    },
  },
} as Meta<typeof Popover>;

export const Main = (props: PopoverPropTypes) => (
  <div style={{ display: 'flex' }}>
    <Popover {...props}>
      <Button>
        <AddIcon size={24} />
      </Button>
    </Popover>
    <Popover {...props}>
      <Button>
        <NotificationsIcon size={24} />
      </Button>
    </Popover>
  </div>
);
