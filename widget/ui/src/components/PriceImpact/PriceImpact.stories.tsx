import type { PriceImpactProps } from './PriceImpact.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { PriceImpact } from './PriceImpact';

const meta: Meta<typeof PriceImpact> = {
  title: 'Components/Price Impact',
  component: PriceImpact,
  args: {
    size: 'small',
    outputUsdValue: '28,490',
    percentageChange: '2.21',
    warningLevel: 'low',
  },
};

export default meta;

export const Main = (args: PriceImpactProps) => <PriceImpact {...args} />;
