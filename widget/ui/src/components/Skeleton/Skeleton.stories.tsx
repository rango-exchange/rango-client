import type { PropTypes } from './Skeleton';
import type { Meta } from '@storybook/react';

import React from 'react';

import { Skeleton } from './Skeleton';

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: {
    width: 20,
    height: 20,
  },
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
} as Meta<typeof Skeleton>;

export const Main = (props: PropTypes) => <Skeleton {...props} />;
