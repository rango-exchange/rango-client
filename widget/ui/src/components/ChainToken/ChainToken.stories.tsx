import type { PropTypes } from './ChainToken.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { ChainToken } from './ChainToken';

const meta: Meta<typeof ChainToken> = {
  title: 'Components/Chain Token',
  component: ChainToken,
  args: {
    chainImage: 'https://api.rango.exchange/blockchains/bsc.svg',
    tokenImage: 'https://api.rango.exchange/tokens/ETH/BNB.png',
    size: 'medium',
  },
};

export default meta;

export const Main = (args: PropTypes) => <ChainToken {...args} />;
