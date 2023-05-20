import React from 'react';
import { Meta } from '@storybook/react';
import { StepDetail, PropTypes } from './StepDetail';

export default {
  title: 'Components/StepDetail',
  component: StepDetail,
  args: {
    logo: 'https://api.rango.exchange/tokens/COSMOS/JUNO.png',
    chainLogo: 'https://api.rango.exchange/swappers/osmosis.png',
    amount: '1',
    symbol: 'JUNO',
    blockchain: 'OSMOSIS',
  },
  argTypes: {
    logo: {
      name: 'logo',
      control: { type: 'text' },
      defaultValue: 'https://api.rango.exchange/tokens/COSMOS/JUNO.png',
    },
    chainLogo: {
      name: 'chainLogo',
      control: { type: 'text' },
      defaultValue: 'https://api.rango.exchange/swappers/osmosis.png',
    },
    amount: {
      name: 'amount',
      control: { type: 'text' },
      defaultValue: '1',
    },
    symbol: {
      name: 'symbol',
      control: { type: 'text' },
      defaultValue: 'JUNO',
    },
    blockchain: {
      name: 'chainAlt',
      control: { type: 'text' },
      defaultValue: 'OSMOSIS',
    },
  },
} as Meta<typeof StepDetail>;

export const Main = (props: PropTypes) => <StepDetail {...props} />;
