import type { SwapInputPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { SwapInput } from '@arlert-dev/ui';
import React from 'react';

const meta: Meta<typeof SwapInput> = {
  title: 'Containers/Swap Input',
  component: SwapInput,
  args: {
    chain: {
      image: 'https://api.rango.exchange/blockchains/bsc.svg',
      displayName: 'BSC',
    },
    token: {
      displayName: 'BNB',
      image: 'https://api.rango.exchange/tokens/ETH/BNB.png',
    },
    label: 'From',
    price: { value: '0.5', usdValue: '151.2' },
  },
};

export default meta;

export const SwapFrom = (args: SwapInputPropTypes) => (
  <SwapInput {...args} label="From" />
);

export const SwapTo = (args: SwapInputPropTypes) => (
  <SwapInput
    {...args}
    label="To"
    mode="To"
    price={{ value: '2.5', usdValue: '610' }}
    percentageChange="6.4"
    warningLevel="high"
  />
);
