import type { PropTypes } from './Popover.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { NotificationsIcon } from '../../icons';
import { Button } from '../Button';
import { AddWalletIcon } from '../Icon';
import { List } from '../List';

import { Popover } from './Popover';

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
      name: 'content',
      control: { type: 'component' },
      defaultValue: null,
    },
    side: {
      name: 'side',
      control: { type: 'select' },
      options: ['top', 'right', 'bottom', 'left'],
      defaultValue: 'bottom',
    },
  },
} as Meta<typeof Popover>;

export const Main = (props: PropTypes) => (
  <div style={{ display: 'flex' }}>
    <Popover {...props}>
      <Button>
        <AddWalletIcon size={24} />
      </Button>
    </Popover>
    <Popover {...props}>
      <Button>
        <NotificationsIcon size={24} />
      </Button>
    </Popover>
  </div>
);
