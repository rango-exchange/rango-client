import type { BarChartPropTypes } from '@arlert-dev/charts';
import type { Meta } from '@storybook/react';

import { BarChart } from '@arlert-dev/charts';
import React from 'react';

import {
  blockchainDailyData,
  buckets,
  colorBucketMap,
  dailyTransactionCounts,
} from './mock';

export default {
  title: 'Charts/BarChart',
  component: BarChart,
  args: {
    height: 475,
    width: 720,
  },
  argTypes: {
    width: {
      control: { type: 'text' },
    },
    height: {
      control: { type: 'text' },
    },
  },
} as Meta<typeof BarChart>;

export const Main = (args: BarChartPropTypes) => {
  const colorBucketMap = new Map([['Transactions', '#469BF5']]);
  return (
    <BarChart
      {...args}
      data={dailyTransactionCounts}
      buckets={['Transactions']}
      colorBucketMap={colorBucketMap}
    />
  );
};

export const StackedBarChart = (args: BarChartPropTypes) => (
  <BarChart
    {...args}
    data={blockchainDailyData}
    buckets={buckets}
    colorBucketMap={colorBucketMap}
  />
);
