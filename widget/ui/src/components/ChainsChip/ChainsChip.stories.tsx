import type { PropTypes } from './ChainsChip.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { Divider } from '../Divider';
import { Typography } from '../Typography';

import { ChainsChip } from './ChainsChip';

export default {
  title: 'Components/ChainsChip',
  component: ChainsChip,
  argTypes: {
    selected: {
      name: 'selected',
      control: { type: 'boolean' },
      defaultValue: false,
    },
  },
} as Meta<typeof ChainsChip>;

export const Main = (args: PropTypes) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <ChainsChip {...args}>
      <Typography size="xsmall" variant="body">
        chains chip
      </Typography>
    </ChainsChip>
    <Divider direction="horizontal" size={12} />
    <ChainsChip {...args}>
      <img
        src="https://api.rango.exchange/blockchains/binance.svg"
        style={{ width: '30px' }}
      />
    </ChainsChip>
  </div>
);
