import type { PropTypes } from './Row.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { AngleRightIcon } from '../Icon';

import { Row } from './Row';

export default {
  title: 'Components/Row',
  component: Row,
  args: {
    title: 'DAI',
    image: 'https://api.rango.exchange/i/VTDf13',
  },
} as Meta<typeof Row>;

export const Main = (args: PropTypes) => <Row {...args} />;
export const WithSubTitle = (args: PropTypes) => (
  <Row subTitle="Dai stablecoin" {...args} />
);
export const WithSubTitleAndTag = (args: PropTypes) => (
  <Row subTitle="Dai stablecoin" tag="Ethereum" {...args} />
);

export const WithSuffix = (args: PropTypes) => (
  <Row suffix={<AngleRightIcon />} {...args} />
);
