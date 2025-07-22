import type { PriceImpactPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { PriceImpact } from '@arlert-dev/ui';
import React from 'react';

const meta: Meta<typeof PriceImpact> = {
  title: 'Components/Price Impact',
  component: PriceImpact,
  args: {
    size: 'small',
    outputUsdValue: '28,490',
    percentageChange: '2.21',
    warningLevel: 'low',
  },
  argTypes: {
    size: {
      options: ['medium', 'small', 'large', 'xmedium', 'xsmall'],
      control: { type: 'select' },
      description: 'medium | small | large | xmedium | xsmall | undefined',
      type: 'string',
    },
    outputColor: {
      name: 'variant',
      control: { type: 'text' },
      type: 'string',
    },
    realOutputUsdValue: {
      control: { type: 'text' },
      type: 'string',
    },
    error: {
      control: { type: 'text' },
      type: 'string',
    },
    warningLevel: {
      options: ['low', 'high'],
      control: { type: 'select' },
      description: 'low | high | undefined',
      type: 'string',
    },
  },
};

export default meta;

export const Main = (args: PriceImpactPropTypes) => <PriceImpact {...args} />;
