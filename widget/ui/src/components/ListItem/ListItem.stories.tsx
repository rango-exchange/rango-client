import React from 'react';
import { ComponentMeta } from '@storybook/react';
import ListItem, { PropTypes } from './ListItem';

export default {
  title: 'List item',
  component: ListItem,
  argTypes: {
    selected: {
      name: 'selected',
      defaultValue: false,
      type: 'boolean',
      if: {
        arg: 'disabled',
        truthy: false,
      },
    },
    disabled: {
      name: 'disabled',
      defaultValue: false,
      type: 'boolean',
      if: {
        arg: 'selected',
        truthy: false,
      },
    },
  },
} as ComponentMeta<typeof ListItem>;

export const Main = (props: PropTypes) => (
  <ListItem {...props}>Just a list item</ListItem>
);
