import { ComponentMeta } from '@storybook/react';
import React from 'react';
import Skeleton, { PropTypes } from './Skeleton';

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
  argTypes: {
    width: {
      name: 'width',
      control: { type: 'select' },
      options: [20, 24, 36, 48],
      defaultValue: 20,
    },
    height: {
      name: 'height',
      control: { type: 'select' },
      options: [20, 24, 36, 48],
      defaultValue: 20,
    },
  },
} as ComponentMeta<typeof Skeleton>;

export const Main = (props: PropTypes) => <Skeleton {...props} />;
