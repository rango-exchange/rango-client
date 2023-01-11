import React from 'react';
import { ComponentMeta } from '@storybook/react';
import ListItem, { PropTypes } from './ListItem';

export default {
  title: 'List item',
  component: ListItem,
  argTypes: {
    isSelected: {
      name: 'isSelected',
      defaultValue: false,
      type: 'boolean',
      if: {
        arg: 'isDisabled',
        truthy: false,
      },
    },
    isDisabled: {
      name: 'isDisabled',
      defaultValue: false,
      type: 'boolean',
      if: {
        arg: 'isSelected',
        truthy: false,
      },
    },
  },
} as ComponentMeta<typeof ListItem>;

export const Main = (props: PropTypes) => (
  <ListItem {...props}>Just a list item</ListItem>
);
