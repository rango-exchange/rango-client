import type { PropTypes } from './Skeleton.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { Divider } from '../Divider';
import { Typography } from '../Typography';

import { Skeleton } from './Skeleton';

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: {
    width: 50,
    height: 50,
  },
  argTypes: {
    variant: {
      name: 'variant',
      defaultValue: 'rounded',
      control: {
        type: 'select',
        options: ['text', 'circular', 'rectangular', 'rounded'],
      },
    },

    size: {
      name: 'size',
      defaultValue: 'small',
      control: {
        type: 'select',
        options: ['small', 'medium', 'large'],
      },
    },
  },
} as Meta<typeof Skeleton>;

export const Main = (args: PropTypes) => (
  <>
    <Skeleton {...args} height={50} width={50} variant="circular" />
    <Divider />
    <Skeleton {...args} variant="text" size="medium" width={200} />
    <Divider />
    <Skeleton width={210} height={60} variant="rectangular" />
    <Divider />
    <Skeleton {...args} width={210} height={60} variant="rounded" />
    <Divider />
    <Typography variant="title" size="small"></Typography>
    <Skeleton {...args} />
  </>
);
