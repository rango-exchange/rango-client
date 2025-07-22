import type { SkeletonPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { Divider, Skeleton, Typography } from '@arlert-dev/ui';
import React from 'react';

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: {
    width: 50,
    height: 50,
  },
  argTypes: {
    variant: {
      defaultValue: 'rounded',
      options: ['text', 'circular', 'rectangular', 'rounded'],
      description: 'text | circular| rectangular | rounded',
      control: {
        type: 'select',
      },
    },

    size: {
      name: 'size',
      defaultValue: 'small',
      options: ['small', 'medium', 'large'],
      description: 'small | medium| large',
      control: { type: 'select' },
    },
  },
} as Meta<typeof Skeleton>;

export const Main = (args: SkeletonPropTypes) => (
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
