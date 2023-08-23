import type { PropTypes } from './Skeleton.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { Divider } from '../Divider';

import { Skeleton } from './Skeleton';

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: {
    width: 50,
  },
} as Meta<typeof Skeleton>;

export const Main = (props: PropTypes) => (
  <>
    <Skeleton height={50} {...props} variant="circular" />
    <Divider />
    <Skeleton {...props} variant="text" size="medium" width={200} />
    <Divider />
    <Skeleton width={210} height={60} variant="rectangular" />
    <Divider />
    <Skeleton width={210} height={60} variant="rounded" />
  </>
);
