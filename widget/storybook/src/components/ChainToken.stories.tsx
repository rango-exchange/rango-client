import type { ChainTokenPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { ChainToken } from '@arlert-dev/ui';
import React from 'react';

const meta: Meta<typeof ChainToken> = {
  title: 'Components/Chain Token',
  component: ChainToken,
  args: {
    chainImage: 'https://api.rango.exchange/blockchains/bsc.svg',
    tokenImage: 'https://api.rango.exchange/tokens/ETH/BNB.png',
    size: 'medium',
  },
  argTypes: {
    size: {
      options: ['medium', 'small', 'large', 'xmedium'],
      control: { type: 'select' },
      description: 'medium | small | large | xmedium',
      type: 'string',
    },
    chianImageId: {
      control: { type: 'text' },
      type: 'string',
    },
    useAsPlaceholder: {
      control: { type: 'boolean' },
      type: 'boolean',
    },
    loading: {
      control: { type: 'boolean' },
      type: 'boolean',
    },
  },
};

export default meta;

export const Main = (args: ChainTokenPropTypes) => <ChainToken {...args} />;
