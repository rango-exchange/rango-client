import React from 'react';
import { ComponentMeta } from '@storybook/react';
import StepDetail, { PropTypes } from './StepDetail';

export default {
  title: 'Components/StepDetail',
  component: StepDetail,
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
} as ComponentMeta<typeof StepDetail>;

export const Main = (props: PropTypes) => <StepDetail {...props} />;
