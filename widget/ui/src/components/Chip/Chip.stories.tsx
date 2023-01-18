import React from 'react';
import { ComponentMeta } from '@storybook/react';

import Chip, { PropTypes } from './Chip';

export default {
  title: 'Chip',
  component: Chip,
} as ComponentMeta<typeof Chip>;

export const Main = (props: PropTypes) => (
  <Chip
    {...props}
    prefix={
      <img
        src="	https://api.rango.exchange/blockchains/binance.svg"
        style={{ width: '20px' }}
      />
    }
  />
);
