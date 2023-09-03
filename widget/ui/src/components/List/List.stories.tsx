import type { Meta, StoryObj } from '@storybook/react';

import React, { useState } from 'react';

import {
  ChevronRightIcon,
  DeleteIcon,
  RefreshIcon,
  WalletIcon,
} from '../../icons';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Chip } from '../Chip';
import { ListItemButton } from '../ListItemButton';

import { List } from './List';

const DEFAULT_TITLE = 'Your title';
const DEFAULT_DESCRIPTION = 'Here you can write your description.';
const DEFAULT_ICON = <WalletIcon />;

type Story = StoryObj<typeof List>;

export default {
  title: 'Components/List',
  component: List,
  argTypes: {},
} satisfies Meta<typeof List>;

export const Item: Story = {
  args: {},
  render: () => {
    return (
      <List
        items={[
          {
            id: '1',
            title: DEFAULT_TITLE,
            description: DEFAULT_DESCRIPTION,
          },
          {
            id: '2',
            title: DEFAULT_TITLE,
          },
          {
            id: '3',
            title: DEFAULT_TITLE,
            description: DEFAULT_DESCRIPTION,
            start: <DeleteIcon />,
          },
          {
            id: '4',
            title: DEFAULT_TITLE,
            start: <RefreshIcon />,
            end: (
              <Button
                type="primary"
                onClick={() => {
                  console.log('Clicked on Hello Button.');
                }}>
                Hello, Button.
              </Button>
            ),
          },
          {
            id: '5',
            title: DEFAULT_TITLE,
            description: DEFAULT_DESCRIPTION,
            start: DEFAULT_ICON,
            end: <ChevronRightIcon />,
          },
          {
            id: '6',
            title: DEFAULT_TITLE,
            description: DEFAULT_DESCRIPTION,
            start: DEFAULT_ICON,
            end: <Checkbox checked />,
          },
          {
            id: '7',
            title: (
              <>
                Dai
                <Chip label="Ethereum" />
              </>
            ),
            description: DEFAULT_DESCRIPTION,
            start: DEFAULT_ICON,
            end: <Checkbox checked />,
          },
          {
            id: '8',
            title: DEFAULT_TITLE,
            description: DEFAULT_DESCRIPTION,
            start: DEFAULT_ICON,
            end: 'end can be anything',
          },
        ]}
      />
    );
  },
};

export const ItemButton: Story = {
  args: {},
  render: () => {
    return <ItemButtonExamples />;
  },
};

function ItemButtonExamples() {
  const [checkedItem, setCheckedItem] = useState('');
  return (
    <List
      type={
        <ListItemButton
          id="_"
          title="List Item Button"
          onClick={(id) => {
            console.log('clicked on ', {
              id,
              checkedItem,
              check: checkedItem === id,
              result: checkedItem === id ? '' : id,
            });
            setCheckedItem(checkedItem === id ? '' : id);
          }}
        />
      }
      items={[
        {
          id: '1',
          title: DEFAULT_TITLE,
          description: DEFAULT_DESCRIPTION,
        },
        {
          id: '2',
          title: DEFAULT_TITLE,
        },
        {
          id: '3',
          title: DEFAULT_TITLE,
          description: DEFAULT_DESCRIPTION,
          start: <DeleteIcon />,
        },
        {
          id: '4',
          title: DEFAULT_TITLE,
          start: <RefreshIcon />,
          end: <Button type="primary">Hello, Button.</Button>,
        },
        {
          id: '5',
          title: DEFAULT_TITLE,
          description: DEFAULT_DESCRIPTION,
          start: DEFAULT_ICON,
          end: <ChevronRightIcon />,
        },
        {
          id: '6',
          title: DEFAULT_TITLE,
          description: DEFAULT_DESCRIPTION,
          start: DEFAULT_ICON,
          end: <Checkbox checked={checkedItem === '6'} />,
        },
        {
          id: '7',
          title: (
            <>
              Dai
              <Chip label="Ethereum" />
            </>
          ),
          description: DEFAULT_DESCRIPTION,
          start: DEFAULT_ICON,
          end: <Checkbox checked={checkedItem === '7'} />,
        },
      ]}
    />
  );
}
